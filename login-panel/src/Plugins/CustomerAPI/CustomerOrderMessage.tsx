import { CustomerMessage } from 'Plugins/CustomerAPI/CustomerMessage'

export class CustomerOrderMessage extends CustomerMessage {
    userName: string;
    orders: string;

    constructor(userName: string, orders: string) {
        super();
        this.userName = userName;
        this.orders = orders;
    }
}