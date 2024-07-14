import { CustomerMessage } from 'Plugins/CustomerAPI/CustomerMessage'

export class CustomerQueryStateMessage extends CustomerMessage {
    orderID: string;
    dishName: string;

    constructor(orderID: string, dishName: string) {
        super();
        this.orderID = orderID;
        this.dishName = dishName;
    }
}
