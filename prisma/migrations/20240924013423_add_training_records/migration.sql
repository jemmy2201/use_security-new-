/*
  Warnings:

  - A unique constraint covering the columns `[stripe_session_id]` on the table `booking_schedules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripe_payment_id]` on the table `booking_schedules` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `booking_schedules` ADD COLUMN `TR_NOTA` VARCHAR(3) NULL,
    ADD COLUMN `TR_OBSE` VARCHAR(3) NULL,
    ADD COLUMN `TR_SSM` VARCHAR(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `stripeid_UNIQUE` ON `booking_schedules`(`stripe_session_id`);

-- CreateIndex
CREATE UNIQUE INDEX `stripepaymentid_UNIQUE` ON `booking_schedules`(`stripe_payment_id`);
