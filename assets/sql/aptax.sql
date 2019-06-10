CREATE TABLE IF NOT EXISTS `aptax` (
    `Id` INT NOT NULL AUTO_INCREMENT, 
    `LocationCode` Varchar(30) NULL, 
    `CancelledTimeStamp` DateTime NULL, 
    `Key` INT NULL, 
    `TaxAuth` Varchar(50) NULL, 
    `Tax` Float NULL, 
    `Ztill` Varchar(10) NULL, 
    `Znum` INT NULL, PRIMARY KEY ( `Id` )
);
