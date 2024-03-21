-- CreateTable
CREATE TABLE `User` (
    `userid` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `role` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserDetail` (
    `lname` VARCHAR(191) NULL,
    `fname` VARCHAR(191) NULL,
    `age` INTEGER NULL,
    `email` VARCHAR(191) NULL,
    `userid` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(200) DEFAULT "",
    UNIQUE INDEX `UserDetail_userid_key`(`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

--Create Table
CREATE TABLE `local_file`(
    `id` CHAR(191) NOT NULL PRIMARY KEY, 
    `diskPath` VARCHAR(191) NULL, 
    `fileName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME
)

-- --Add attribute avt
-- ALTER TABLE `UserDetail` ADD COLUMN `avatar` VARCHAR(200) DEFAULT NULL;

-- AddForeignKey
ALTER TABLE `UserDetail` ADD CONSTRAINT `UserDetail_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `User`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;