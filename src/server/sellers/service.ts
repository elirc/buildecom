import { normalizeCommissionBasisPoints } from "@/domain/sellers/commission";
import { canApproveSeller, canSuspendSeller, type SellerStatus } from "@/domain/sellers/seller-policy";
import { ApiError } from "@/server/api/errors";
import type { RequestContext } from "@/server/api/request-context";
import type { SessionUser } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import "server-only";

type OnboardingInput = {
  actor: SessionUser;
  shopName: string;
  displayName: string;
  supportEmail: string;
  businessType: "INDIVIDUAL" | "COMPANY";
  taxCountry: string;
  context: RequestContext;
};

export async function upsertSellerOnboarding(input: OnboardingInput) {
  const seller = await prisma.sellerProfile.upsert({
    where: { ownerId: input.actor.id },
    create: {
      ownerId: input.actor.id,
      shopName: input.shopName,
      displayName: input.displayName,
      supportEmail: input.supportEmail,
      businessType: input.businessType,
      taxCountry: input.taxCountry,
      commissionBasisPoints: normalizeCommissionBasisPoints(),
      status: "PENDING"
    },
    update: {
      shopName: input.shopName,
      displayName: input.displayName,
      supportEmail: input.supportEmail,
      businessType: input.businessType,
      taxCountry: input.taxCountry,
      status: "PENDING"
    }
  });

  await prisma.auditLog.create({
    data: {
      actorType: "USER",
      actorId: input.actor.id,
      action: "seller.onboarding.submit",
      entityType: "SellerProfile",
      entityId: seller.id,
      requestId: input.context.requestId,
      ipAddress: input.context.ipAddress
    }
  });

  return seller;
}

export async function moderateSeller(input: {
  actor: SessionUser;
  sellerId: string;
  status: SellerStatus;
  internalNote: string;
  context: RequestContext;
}) {
  const seller = await prisma.sellerProfile.findUniqueOrThrow({
    where: { id: input.sellerId }
  });

  if (input.status === "APPROVED" && !canApproveSeller(seller.status)) {
    throw new ApiError("SELLER_INVALID_STATUS_CHANGE", 409, "Seller cannot be approved from the current state.");
  }

  if (input.status === "SUSPENDED" && !canSuspendSeller(seller.status)) {
    throw new ApiError("SELLER_INVALID_STATUS_CHANGE", 409, "Seller cannot be suspended from the current state.");
  }

  return prisma.$transaction(async (tx) => {
    const updatedSeller = await tx.sellerProfile.update({
      where: { id: input.sellerId },
      data: { status: input.status }
    });

    await tx.auditLog.create({
      data: {
        actorType: "USER",
        actorId: input.actor.id,
        action: "seller.status.update",
        entityType: "SellerProfile",
        entityId: input.sellerId,
        requestId: input.context.requestId,
        ipAddress: input.context.ipAddress,
        metadata: {
          from: seller.status,
          to: input.status,
          internalNote: input.internalNote
        }
      }
    });

    return updatedSeller;
  });
}

export async function moderateDispute(input: {
  actor: SessionUser;
  disputeId: string;
  status: "OPEN" | "REVIEWING" | "CLOSED";
  resolution?: "REFUND_BUYER" | "RELEASE_TO_SELLER" | "ESCALATE";
  internalNote: string;
  context: RequestContext;
}) {
  return prisma.$transaction(async (tx) => {
    const dispute = await tx.dispute.update({
      where: { id: input.disputeId },
      data: { status: input.status }
    });

    await tx.auditLog.create({
      data: {
        actorType: "USER",
        actorId: input.actor.id,
        action: "dispute.status.update",
        entityType: "Dispute",
        entityId: input.disputeId,
        requestId: input.context.requestId,
        ipAddress: input.context.ipAddress,
        metadata: {
          status: input.status,
          resolution: input.resolution,
          internalNote: input.internalNote
        }
      }
    });

    return dispute;
  });
}
