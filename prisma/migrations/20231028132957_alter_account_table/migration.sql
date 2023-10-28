-- CreateEnum
CREATE TYPE "AccountStatuses" AS ENUM ('PENDING', 'ACTIVE', 'BLOCKED');

-- AlterTable
ALTER TABLE "account" ADD COLUMN     "intrusts" INTEGER[],
ADD COLUMN     "status" "AccountStatuses" NOT NULL DEFAULT 'PENDING';
