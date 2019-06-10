CREATE TABLE IF NOT EXISTS `apcsitem` (
    `Id` INT NOT NULL AUTO_INCREMENT, 
    `LocationCode` Varchar(30) NULL, 
    `CancelledTimeStamp` DateTime NULL, 
    `Key` INT NOT NULL, 
    `HeadKey` Int NULL, 
    `ItemID` Varchar(50) NULL, 
    `Sort` Varchar(5) NULL, 
    `Quantity` Float NULL, 
    `Price` Float NULL, 
    `List` Float NULL, 
    `Ext` Float NULL, 
    `Txbl` Bit(1) NULL, 
    `Cost` Float NULL, 
    `Status` Varchar(1) NULL, 
    `ChgPri` Varchar(10) NULL, 
    `OrigPrice` Float NULL, 
    `User` Varchar(10) NULL, 
    `TaxCode` Varchar(50) NULL, 
    `Ztill` Varchar(50) NULL, 
    `Znum` Int NULL, 
    `IType` Varchar(50) NULL, 
    `remoteDisplay` Bit(1) NULL, 
    `vatTax` Float NULL, 
    `vatTax2` Float NULL, 
    `vatGross` Float NULL, 
    `serialNumber` Varchar(50) NULL, 
    `CarryOut` Bit(1) NULL, 
    `DisplayOnly` Bit(1) NULL, 
    `Category` Varchar(50) NULL, 
    `CompReason` Varchar(250) NULL, 
    `CompAmount` Float NULL, 
    `Manager` Varchar(20) NULL, 
    `Hidden` Bit(1) NULL, 
    `Created` Text NULL, 
    `MasterLine` Int NULL, 
    `ChangedQuantity` Varchar(50) NULL, 
    `ChangedDescription` Varchar(50) NULL, PRIMARY KEY ( `Id` )
);