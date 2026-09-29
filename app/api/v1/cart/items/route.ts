import { fail, ok } from "@/server/api/responses";
import { getRequestContext } from "@/server/api/request-context";
import { requireRole } from "@/server/auth/guards";
import { prisma } from "@/server/db/prisma";
import { enforceRateLimit } from "@/server/security/rate-limit";
import { parseJsonBody } from "@/server/validation/request";
import { cartItemSchema } from "@/server/validation/schemas";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const context = getRequestContext(request);

  try {
    const session = await requireRole(request, ["BUYER"]);
    await enforceRateLimit({ key: `cart:${session.id}`, limit: 120, windowSeconds: 60 });
    const body = await parseJsonBody(request, cartItemSchema);
    const existingCartId = request.cookies.get("mf_cart_id")?.value;

    const product = await prisma.product.findFirstOrThrow({
      where: {
        id: body.productId,
        isActive: true,
        seller: { status: "APPROVED" }
      }
    });

    if (product.stock < body.quantity) {
      throw new Error("CART_INSUFFICIENT_STOCK");
    }

    const existingCart = existingCartId
      ? await prisma.cart.findFirst({ where: { id: existingCartId, buyerId: session.id } })
      : null;

    const cart = existingCart
      ? await prisma.cart.update({
          where: { id: existingCart.id },
          data: {
            items: {
              upsert: {
                where: {
                  cartId_productId: {
                    cartId: existingCart.id,
                    productId: body.productId
                  }
                },
                create: {
                  productId: body.productId,
                  quantity: body.quantity
                },
                update: {
                  quantity: body.quantity
                }
              }
            }
          },
          include: { items: true }
        })
      : await prisma.cart.create({
          data: {
            buyerId: session.id,
            items: {
              create: {
                productId: body.productId,
                quantity: body.quantity
              }
            }
          },
          include: { items: true }
        });

    const response = ok({ cartId: cart.id, itemCount: cart.items.length });
    response.cookies.set("mf_cart_id", cart.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });

    return response;
  } catch (error) {
    return fail(error, context.requestId);
  }
}
