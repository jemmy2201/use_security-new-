-- CreateTable
CREATE TABLE `activation_phones` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `activation` VARCHAR(255) NOT NULL,
    `status` VARCHAR(255) NOT NULL,
    `nric` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking_schedules` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `app_type` VARCHAR(255) NOT NULL,
    `card_id` VARCHAR(255) NULL,
    `grade_id` VARCHAR(255) NULL,
    `declaration_date` VARCHAR(255) NULL,
    `trans_date` VARCHAR(255) NULL,
    `expired_date` VARCHAR(255) NULL,
    `appointment_date` VARCHAR(255) NULL,
    `time_start_appointment` VARCHAR(255) NULL,
    `time_end_appointment` VARCHAR(255) NULL,
    `gst_id` VARCHAR(255) NULL,
    `transaction_amount_id` VARCHAR(255) NULL,
    `grand_total` VARCHAR(255) NULL,
    `Status_app` VARCHAR(255) NULL,
    `Status_draft` VARCHAR(255) NULL,
    `paymentby` VARCHAR(255) NULL,
    `status_payment` VARCHAR(255) NULL,
    `receiptNo` VARCHAR(255) NULL,
    `nric` VARCHAR(255) NOT NULL,
    `passid` VARCHAR(255) NOT NULL,
    `resubmission_date` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `array_grade` VARCHAR(255) NULL,
    `bsoc` VARCHAR(255) NULL,
    `ssoc` VARCHAR(255) NULL,
    `sssc` VARCHAR(255) NULL,
    `netstxnref` VARCHAR(255) NULL,
    `txnrand` VARCHAR(255) NULL,
    `stagerespcode` VARCHAR(255) NULL,
    `netsTxnStatus` VARCHAR(255) NULL,
    `licence_status` VARCHAR(255) NULL,
    `card_issue` VARCHAR(255) NULL DEFAULT 'N',
    `data_barcode_paynow` LONGTEXT NULL,
    `Import_Status` VARCHAR(1) NULL,
    `TaxReceipt` VARCHAR(20) NULL,
    `TR_RTT` VARCHAR(3) NULL,
    `TR_CSSPB` VARCHAR(3) NULL,
    `TR_CCTC` VARCHAR(3) NULL,
    `TR_HCTA` VARCHAR(3) NULL,
    `TR_X_RAY` VARCHAR(3) NULL,
    `TR_AVSO` VARCHAR(3) NULL,
    `QRstring` VARCHAR(255) NULL,
    `union_member` INTEGER NULL,
    `stripe_session_id` VARCHAR(255) NULL,
    `stripe_payment_id` VARCHAR(255) NULL,

    UNIQUE INDEX `booking_schedules_receiptno_unique`(`receiptNo`),
    UNIQUE INDEX `passid_UNIQUE`(`passid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dateholidays` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `date` VARCHAR(255) NULL,
    `name_holiday` VARCHAR(255) NULL,
    `time_work` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `failed_jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `connection` TEXT NOT NULL,
    `queue` TEXT NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `exception` LONGTEXT NOT NULL,
    `failed_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grades` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `card_id` VARCHAR(255) NULL,
    `name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(255) NULL,
    `bsoc` VARCHAR(255) NOT NULL,
    `ssoc` VARCHAR(255) NOT NULL,
    `sssc` VARCHAR(255) NOT NULL,
    `created_by` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `delete_soft` VARCHAR(255) NULL,
    `short_value` VARCHAR(20) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gsts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `create_date` VARCHAR(255) NOT NULL,
    `amount_gst` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maintenance` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `maintenace_flag` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `migration` VARCHAR(255) NOT NULL,
    `batch` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_resets` (
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,

    INDEX `password_resets_email_index`(`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedule_limits` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `date_schedule_limit` TIMESTAMP(0) NULL,
    `start_at` VARCHAR(255) NULL,
    `end_at` VARCHAR(255) NULL,
    `amount` VARCHAR(255) NULL,
    `status` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sertifikats` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `app_type` VARCHAR(255) NULL,
    `card_id` VARCHAR(255) NULL,
    `grade_id` VARCHAR(255) NULL,
    `declaration_date` VARCHAR(255) NULL,
    `trans_date` VARCHAR(255) NULL,
    `expired_date` VARCHAR(255) NULL,
    `appointment_date` VARCHAR(255) NULL,
    `time_start_appointment` VARCHAR(255) NULL,
    `time_end_appointment` VARCHAR(255) NULL,
    `gst` VARCHAR(255) NULL,
    `grand_gst` VARCHAR(255) NULL,
    `transaction_amount` VARCHAR(255) NULL,
    `grand_total` VARCHAR(255) NULL,
    `Status_app` VARCHAR(255) NULL,
    `paymentby` VARCHAR(255) NULL,
    `status_payment` VARCHAR(255) NULL,
    `receiptNo` VARCHAR(255) NULL,
    `nric` VARCHAR(255) NOT NULL,
    `passid` VARCHAR(255) NULL,
    `passexpirydate` VARCHAR(255) NULL,
    `resubmission_date` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `array_grade` VARCHAR(255) NULL,
    `bsoc` VARCHAR(255) NULL,
    `ssoc` VARCHAR(255) NULL,
    `sssc` VARCHAR(255) NULL,
    `netstxnref` VARCHAR(255) NULL,
    `txnrand` VARCHAR(255) NULL,
    `stagerespcode` VARCHAR(255) NULL,
    `netsTxnStatus` VARCHAR(255) NULL,
    `TR_RTT` VARCHAR(3) NULL,
    `TR_CSSPB` VARCHAR(3) NULL,
    `TR_CCTC` VARCHAR(3) NULL,
    `TR_HCTA` VARCHAR(3) NULL,
    `TR_X_RAY` VARCHAR(3) NULL,
    `TR_AVSO` VARCHAR(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `so_update_info` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `NRIC` VARCHAR(255) NULL,
    `PassID` VARCHAR(255) NULL,
    `Name` VARCHAR(255) NULL,
    `Grade` VARCHAR(255) NULL,
    `New_Grade` VARCHAR(255) NULL,
    `TR_RTT` VARCHAR(255) NULL,
    `TR_CSSPB` VARCHAR(255) NULL,
    `TR_CCTC` VARCHAR(255) NULL,
    `TR_HCTA` VARCHAR(255) NULL,
    `TR_X_RAY` VARCHAR(255) NULL,
    `SKILL_BFM` VARCHAR(255) NULL,
    `SKILL_BSS` VARCHAR(255) NULL,
    `SKILL_FSM` VARCHAR(255) NULL,
    `SKILL_CERT` VARCHAR(255) NULL,
    `SKILL_COSEM` VARCHAR(255) NULL,
    `Date_Submitted` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `so_update_info_passid_unique`(`PassID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `t_grades` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_receipt_nos` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `receiptNo` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction_amounts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `app_type` VARCHAR(255) NULL,
    `card_type` VARCHAR(255) NULL,
    `grade_id` VARCHAR(255) NULL,
    `grade_type` VARCHAR(255) NULL,
    `transaction_amount` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `password` VARCHAR(255) NULL,
    `nric` VARCHAR(255) NULL,
    `passportexpirydate` VARCHAR(255) NULL,
    `passportnumber` VARCHAR(255) NULL,
    `mobileno` VARCHAR(255) NULL,
    `homeno` VARCHAR(255) NULL,
    `photo` VARCHAR(255) NULL,
    `time_login_at` DATE NULL,
    `role` VARCHAR(255) NULL,
    `web` VARCHAR(255) NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `wpexpirydate` VARCHAR(255) NULL,

    UNIQUE INDEX `users_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_idx` (
    `id` BIGINT UNSIGNED NULL,
    `name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `email_verified_at` TIMESTAMP(0) NULL,
    `password` VARCHAR(255) NULL,
    `nric` VARCHAR(255) NULL,
    `passid` VARCHAR(255) NULL,
    `passexpirydate` VARCHAR(255) NULL,
    `mobileno` VARCHAR(255) NULL,
    `homeno` VARCHAR(255) NULL,
    `photo` VARCHAR(255) NULL,
    `time_login_at` DATE NULL,
    `role` VARCHAR(255) NULL,
    `remember_token` VARCHAR(100) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,
    `App_Type` VARCHAR(255) NULL,
    `Grade_ID` VARCHAR(255) NULL,
    `Card_ID` VARCHAR(255) NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
