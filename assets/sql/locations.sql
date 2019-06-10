CREATE TABLE IF NOT EXISTS `Locations` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `LocationCode` Varchar(30) NULL,
    `LastUpdateTimeStamp` DateTime NULL,
    `Version` Varchar(50) NULL, PRIMARY KEY ( `Id` )
);