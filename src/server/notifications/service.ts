import { prisma } from "@/server/db/prisma";
import "server-only";

type NotificationInput = {
  userId: string;
  type: "ORDER" | "INVENTORY" | "PAYOUT" | "DISPUTE" | "SECURITY" | "SYSTEM";
  title: string;
  body: string;
};

export async function createNotification(input: NotificationInput) {
  return prisma.notification.create({
    data: input
  });
}

export async function notifyLowStock(input: { sellerOwnerId: string; productTitle: string; remainingStock: number }) {
  return createNotification({
    userId: input.sellerOwnerId,
    type: "INVENTORY",
    title: "Low stock alert",
    body: `${input.productTitle} has ${input.remainingStock} units remaining.`
  });
}

export async function notifyOrderStatus(input: { buyerId: string; orderNumber: string; status: string }) {
  return createNotification({
    userId: input.buyerId,
    type: "ORDER",
    title: "Order updated",
    body: `${input.orderNumber} is now ${input.status.toLowerCase()}.`
  });
}
