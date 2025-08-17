-- CreateTable
CREATE TABLE `universities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `website` VARCHAR(200) NULL,
    `application_url` VARCHAR(500) NULL,
    `specialty` TEXT NULL,
    `country` VARCHAR(100) NOT NULL DEFAULT 'Germany',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `universities_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `university_programs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `university_id` INTEGER NOT NULL,
    `name` VARCHAR(200) NOT NULL,
    `level` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `universityId_name_level`(`university_id`, `name`, `level`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `university_programs` ADD CONSTRAINT `university_programs_university_id_fkey` FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
