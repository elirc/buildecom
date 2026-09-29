import { fail, ok } from "@/server/api/responses";
import { getRequestContext } from "@/server/api/request-context";
import { getMarketplaceHome } from "@/server/catalog/queries";
import { productQuerySchema } from "@/server/validation/schemas";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const context = getRequestContext(request);

  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const query = productQuerySchema.parse(params);
    const page = await getMarketplaceHome({
      query: query.q,
      category: query.category,
      sellerId: query.sellerId,
      priceBand: query.priceBand
    });

    return ok(page);
  } catch (error) {
    return fail(error, context.requestId);
  }
}
