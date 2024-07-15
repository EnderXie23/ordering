import { CustomerMessage } from 'Plugins/CustomerAPI/CustomerMessage'

interface OrderInfo {
    dishName: string;
    orderCount: string;
    price: string;
    takeout: string;
}

export class CustomerOrderMessage extends CustomerMessage {
    userName: string;
    orderID: string
    orderPart:string
    orders: OrderInfo[];

    constructor(userName: string,orderID: string,orderPart:string, orders: OrderInfo[]) {
        super();
        this.userName = userName;
        this.orderID = orderID;
        this.orderPart = orderPart;
        this.orders = orders;
    }
}