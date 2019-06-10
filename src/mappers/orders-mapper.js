const xmlParser = require('js2xmlparser');
const path = require('path');
const BaseMapper = require('../mappers/base-mapper');

class OrdersMapper extends BaseMapper {
    getMappedTransactions(response, format) {
        const results = response.results;
        format = format || 'json';
        let currentOrderKey = null;
        let previousOrderKey = null;
        let currentOrderItems = [];
        let transactions = [];
        let currentTransactionTotal = 0.0;
        let lastNode = {};
        
        results.map((currentNode) => {
            currentOrderKey = currentNode.header_Key;
            lastNode = currentNode;
            // if new order, empty line set:
            if (currentOrderKey !== null && previousOrderKey !== null && currentOrderKey !== previousOrderKey) {
                transactions.push(this.getTransactionNode(currentNode, currentOrderItems, currentTransactionTotal));
                currentTransactionTotal = 0;
                currentOrderItems = {};
            }
            
            currentTransactionTotal += currentNode.item_Ext !== null ? currentNode.item_Ext : 0.0;
            if (currentNode.item_HeadKey !== null) {
                currentOrderItems.push(this.getItemNode(currentNode));
            }
            previousOrderKey = currentNode.header_Key;
        });
        if (results.length > 0) {
            transactions.push(this.getTransactionNode(lastNode, currentOrderItems, currentTransactionTotal));
        }
        response.results =  { Transactions: transactions };

        
        if (format.toLowerCase() === 'xml') {
            const options = {
                wrapHandlers: {
                    "LineItems": (key, value) => "LineItem",
                    "Transactions": (key, value) => "Transaction"
                }
            };
            return xmlParser.parse("response", response, options); 
        }
        return response;
    };

    getTransactionNode(transaction, items, total) {
        return {
            DateEntered: this.defaultsToIfNull(transaction.header_DateEntered, ''),
            DateInvoiced: this.defaultsToIfNull(transaction.header_DateInvoiced, ''),
            TransactionNumber: this.defaultsToIfNull(transaction.header_Key, ''),
            Till: this.defaultsToIfNull(transaction.header_Ztill, ''),
            Sequence: this.defaultsToIfNull(transaction.header_Znum, ''),
            Invoice: this.defaultsToIfNull(transaction.header_InvNum, ''),
            TransactionTotal: total,
            GuestCount: this.defaultsToIfNull(transaction.header_GuestCount, ''),
            Server: this.defaultsToIfNull(transaction.header_serverId, ''),
            // fields that are in Transaction object but aren't required for the API
            // are served empty here for future reference:
            CompanyName: '',
            First: '',
            Middle: '',
            Last: '',
            Contact: '',
            Address1: '',
            Address2: '',
            Address3: '',
            City: '',
            State: '',
            Zip: '',
            Phone: '',
            Fax: '',
            Email: '',
            CustomerCode: '',
            Quantity: '',
            ReceiptEmail: '',
            // TODO: needs to be parsed
            LocationCode: this.defaultsToIfNull(transaction.header_LocationCode, ''),

            // subsets:
            LineItems: items,
            Tenders: [],
            Taxes: []
        };
    }

    getItemNode(transaction) {
        return {
            // TODO: needs to be parsed:
            Transaction: this.defaultsToIfNull(transaction.item_HeadKey, ''),
            LocationCode: this.defaultsToIfNull(transaction.item_LocationCode, ''),
            Cost: this.defaultsToIfNull(transaction.item_Cost, ''),
            Till: this.defaultsToIfNull(transaction.item_Ztill, ''),
            Sequence: this.defaultsToIfNull(transaction.item_Znum, ''),
            Id: this.defaultsToIfNull(transaction.item_Key, ''),
            ItemId: this.defaultsToIfNull(transaction.item_ItemID, ''),
            Quantity: this.defaultsToIfNull(transaction.item_Quantity, ''),
            Price: this.defaultsToIfNull(transaction.item_Price, ''),
            OriginalPrice: this.defaultsToIfNull(transaction.item_OrigPrice, ''),
            PriceChangedBy: this.defaultsToIfNull(transaction.item_ChgPri, ''),
            List: this.defaultsToIfNull(transaction.item_List, ''),
            Total: this.defaultsToIfNull(transaction.item_Ext, ''),
            User: this.defaultsToIfNull(transaction.item_User, ''),
            CompReason: this.defaultsToIfNull(transaction.item_CompReason, ''),
            CompAmount: this.defaultsToIfNull(transaction.item_CompAmount, ''),
            
            ItemType: this.defaultsToIfNull(transaction.item_IType, ''),
            LineItemTaxable: this.defaultsToIfNull(transaction.item_Txbl, ''),
            VatTax1: this.defaultsToIfNull(transaction.item_vatTax, ''),
            VatTax2: this.defaultsToIfNull(transaction.item_vatTax2, ''),
            VatGross: this.defaultsToIfNull(transaction.item_vatGross, ''),
            TaxCode: this.defaultsToIfNull(transaction.item_TaxCode, ''),
            CarryOut: this.defaultsToIfNull(transaction.item_CarryOut, ''),
            SerialNumber: this.defaultsToIfNull(transaction.item_serialNumber, ''),
            QuantityChangedBy: this.defaultsToIfNull(transaction.item_ChangedQuantity, ''),
            LineStatus: this.defaultsToIfNull(transaction.item_Status, ''),
            // fields that are in LineItem object but aren't required for the API
            // are served empty here for future reference:
            Tax: '',
            DoNotPrint: '',
            DisplayOnRemote: '',
            Sort: '',
            Choices: '',
            NewLine: '',
            ItemDescription: '',
            AltDescription: '',
            Invoiced: '',
            NoDiscount: '',
            Manager: '',
            IsAppetizer: '',
            Created: '',
            IsGiftCard: '',
            IsScale: '',
            MasterItem: '',
            LoyaltyRedeemable: '',
            NoPartialQuantity: '',
            ChangedDescription: '',
            IsBundle: '',
            IsSalePrice: '',
            ComoRedemptionCode: ''
        };
    }
}

module.exports = OrdersMapper;
