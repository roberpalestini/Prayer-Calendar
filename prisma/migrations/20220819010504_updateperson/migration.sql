-- DropIndex
DROP INDEX "ministries_details_key";

-- DropIndex
DROP INDEX "people_email_key";

-- AlterTable
ALTER TABLE "ministries" ALTER COLUMN "details" DROP NOT NULL;

-- AlterTable
ALTER TABLE "people" ADD COLUMN     "addressOne" TEXT,
ADD COLUMN     "addressTwo" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "state" TEXT,
ALTER COLUMN "email" DROP NOT NULL;
