CREATE TABLE IF NOT EXISTS `apcshead` (
    `Id` INT NOT NULL AUTO_INCREMENT, 
    `LocationCode` Varchar(30) NULL, 
    `CloudTimeStamp` DateTime NULL, 
    `CancelledTimeStamp` DateTime NULL, 
    `Key` Int NOT NULL, 
    `DateEntered` DateTime NULL, 
    `DateInvoiced` DateTime NULL, 
    `InvNum` Int NULL, 
    `Ztill` Varchar(10) NULL, 
    `Znum` Int NULL, 
    `TaxCode` Varchar(50) NULL, 
    `Tax` Float NULL, 
    `CustomerID` Int NULL, 
    `openBy` Varchar(10) NULL, 
    `CustomerCode` Varchar(50) NULL, 
    `OrderID` Varchar(50) NULL, 
    `OrderIdExt` Varchar(20) NULL, 
    `remoteDisplay` Bit(1) NULL, 
    `serverId` Varchar(10) NULL, 
    `tableId` Varchar(10) NULL, 
    `CarryOut` Bit(1) NULL, 
    `Request` Varchar(50) NULL, 
    `PreAuthId` Varchar(50) NULL, 
    `PreAuthCode` Varchar(5) NULL, 
    `PreAuthNumber` Varchar(25) NULL, 
    `PreAuthExp` Varchar(5) NULL, 
    `PreAuthApproval` Varchar(50) NULL, 
    `PreAuthHolder` Varchar(50) NULL, 
    `PreAuthAmount` Float NULL, 
    `DiscountItem` Varchar(50) NULL, 
    `DiscountPercent` Float NULL, 
    `GuestCount` SmallInt NULL, 
    `AutoTip` Bit(1) NULL, 
    `ReceiptEmail` Varchar(250) NULL, 
    `OriginalInvoice` Int NULL, 
    `OrderFired` Bit(1) NULL, 
    `CheckPrinted` Bit(1) NULL, 
    `PreAuthRecordNumber` Varchar(150) NULL, 
    PRIMARY KEY ( `Id` )
    );