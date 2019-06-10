CREATE DATABASE IF NOT EXISTS `cloudApiMaster`;
CREATE USER IF NOT EXISTS 'apiaccess' IDENTIFIED BY '$y-3eCu6VgK}8FB!';
GRANT ALL PRIVILEGES ON `cloudApiMaster`.* TO 'apiaccess';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS `cloudApiMaster`.`clientAccess` (
    `id` INT NOT NULL AUTO_INCREMENT, 
    `serialNumber` VARCHAR(256) NOT NULL,
    `databaseName` VARCHAR(256) NOT NULL,
    `isActive` SMALLINT(1) NOT NULL,
    `accessTokenSalt` VARCHAR(256) NOT NULL,
    `accessTokenHash` VARCHAR(256) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE (`serialNumber`)
);