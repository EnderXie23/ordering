import { CustomerMessage } from 'Plugins/CustomerAPI/CustomerMessage'

export class CustomerOrderMessage extends CustomerMessage {
    userName: string;
    orderID: string
    orderPart:string
    orders: string;

    constructor(userName: string,orderID: string,orderPart:string, orders: string) {
        super();
        this.userName = userName;
        this.orderID = orderID;
        this.orderPart = orderPart;
        this.orders = orders;
    }
}