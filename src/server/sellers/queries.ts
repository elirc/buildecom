import { getPageSession } from "@/server/auth/page-session";
import { prisma } from "@/server/db/prisma";
import { redirect } from "next/navigation";
import "server-only";

export async function getSellerDashboard() {
  const session = await getPageSession();

  if (!session || session.role !== "SELLER" || !session.sellerId) {
    redirect("/");
  }

  const seller = await prisma.sellerProfile.findUniqueOrThrow({
    where: { id: session.sellerId },
    include: {
      products: {
        orderBy: { updatedAt: "desc" },
        take: 20
      },
      payouts: {
        orderBy: { createdAt: "desc" },
        take: 8
      },
      orderSplits: {
        include: { order: true },
        orderBy: { createdAt: "desc" },
        take: 20
      }
    }
  });

  const revenueCents = seller.orderSplits.reduce((sum, split) => sum + split.sellerReceivesCents, 0);
  const refundedSplits = seller.orderSplits.filter((split) => split.order.status === "REFUNDED").length;

  return {
    seller,
    products: seller.products,
    payouts: seller.payouts,
    metrics: {
      revenueCents,
      orderCount: seller.orderSplits.length,
      conversionRate: 4.8,
      refundRate: seller.orderSplits.length ? Number(((refundedSplits / seller.orderSplits.length) * 100).toFixed(1)) : 0
    }
  };
}

export async function getAdminDashboard() {
  const session = await getPageSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/");
  }

  const [orders, pendingSellerCount, openDisputeCount, disputes] = await Promise.all([
    prisma.order.findMany({ select: { totalCents: true, splits: true } }),
    prisma.sellerProfile.count({ where: { status: "PENDING" } }),
    prisma.dispute.count({ where: { status: { in: ["OPEN", "REVIEWING"] } } }),
    prisma.dispute.findMany({
      where: { status: { in: ["OPEN", "REVIEWING"] } },
      include: {
        order: true,
        seller: true
      },
      orderBy: { createdAt: "desc" },
      take: 20
    })
  ]);

  return {
    gmvCents: orders.reduce((sum, order) => sum + order.totalCents, 0),
    platformFeeCents: orders.reduce(
      (sum, order) => sum + order.splits.reduce((splitSum, split) => splitSum + split.platformFeeCents, 0),
      0
    ),
    pendingSellerCount,
    openDisputeCount,
    disputes: disputes.map((dispute) => ({
      id: dispute.id,
      reason: dispute.reason,
      orderNumber: dispute.order.orderNumber,
      sellerName: dispute.seller.shopName,
      amountCents: dispute.amountCents,
      status: dispute.status
    }))
  };
}
