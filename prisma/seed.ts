import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@marketforge.test" },
    update: {},
    create: {
      email: "admin@marketforge.test",
      passwordHash: await bcrypt.hash("ChangeMe-Admin-12345", 12),
      role: "ADMIN"
    }
  });

  const sellerUser = await prisma.user.upsert({
    where: { email: "seller@marketforge.test" },
    update: {},
    create: {
      email: "seller@marketforge.test",
      passwordHash: await bcrypt.hash("ChangeMe-Seller-12345", 12),
      role: "SELLER"
    }
  });

  const buyer = await prisma.user.upsert({
    where: { email: "buyer@marketforge.test" },
    update: {},
    create: {
      email: "buyer@marketforge.test",
      passwordHash: await bcrypt.hash("ChangeMe-Buyer-12345", 12),
      role: "BUYER",
      addresses: {
        create: {
          fullName: "Avery Stone",
          line1: "100 Market Street",
          city: "San Francisco",
          region: "CA",
          postalCode: "94105",
          countryCode: "US"
        }
      }
    }
  });

  const seller = await prisma.sellerProfile.upsert({
    where: { ownerId: sellerUser.id },
    update: {},
    create: {
      ownerId: sellerUser.id,
      shopName: "Copper & Clay",
      displayName: "Copper & Clay",
      supportEmail: "support@copperclay.test",
      location: "Portland, OR",
      status: "APPROVED",
      businessType: "COMPANY",
      taxCountry: "US",
      commissionBasisPoints: 1200,
      stripeAccountId: "acct_test_copper"
    }
  });

  await prisma.product.upsert({
    where: { slug: "hand-thrown-breakfast-bowl" },
    update: {},
    create: {
      sellerId: seller.id,
      title: "Hand-thrown breakfast bowl",
      slug: "hand-thrown-breakfast-bowl",
      description: "Wheel-thrown stoneware with a satin glaze.",
      category: "Home",
      sku: "CC-BOWL-001",
      priceCents: 4800,
      stock: 24,
      images: {
        create: {
          url: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=900&q=80",
          alt: "Hand-thrown ceramic bowl",
          sortOrder: 0
        }
      }
    }
  });

  await prisma.auditLog.create({
    data: {
      actorType: "USER",
      actorId: admin.id,
      action: "seed.create",
      entityType: "Database",
      entityId: "seed",
      metadata: {
        buyerId: buyer.id,
        sellerId: seller.id
      }
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
