import "server-only";
import { prisma } from "@/lib/prisma";

let initialized = false;

export async function ensureBlogSchema() {
  if (initialized) return;

  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      CREATE TYPE "BlogPostStatus" AS ENUM ('DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "BlogPost" (
      "id" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "excerpt" TEXT NOT NULL,
      "body" TEXT NOT NULL,
      "category" TEXT NOT NULL,
      "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
      "authorName" TEXT NOT NULL DEFAULT 'Prateek G.',
      "status" "BlogPostStatus" NOT NULL DEFAULT 'DRAFT',
      "featured" BOOLEAN NOT NULL DEFAULT false,
      "publishedAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
    )
  `);

  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "BlogPost_slug_key" ON "BlogPost"("slug")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "BlogPost_status_publishedAt_idx" ON "BlogPost"("status", "publishedAt")`);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "BlogPost_category_idx" ON "BlogPost"("category")`);
  initialized = true;
}
