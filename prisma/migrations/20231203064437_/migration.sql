-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `movieId` INTEGER NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `deletedAt` DATETIME(6) NULL,
    `userno` INTEGER NOT NULL,
    `comment` VARCHAR(255) NOT NULL,

    INDEX `movieId_idx`(`movieId`),
    INDEX `user_no_idx`(`userno`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Movie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `audience` INTEGER NOT NULL,
    `movieCd` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `Movie_movieCd_key`(`movieCd`),
    INDEX `movieId`(`movieCd`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(30) NOT NULL,
    `nickname` VARCHAR(30) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `deletedAt` DATETIME(6) NULL,

    UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userno_fkey` FOREIGN KEY (`userno`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`movieCd`) ON DELETE RESTRICT ON UPDATE CASCADE;
