import { CustomerMessage } from 'Plugins/CustomerAPI/CustomerMessage'

export class CustomerQueryStateMessage extends CustomerMessage {
    orderID: string;
    orderPart:string
    dish_name:string

    constructor(orderID: string,orderPart:string,dish_name:string) {
        super();
        this.orderID = orderID;
        this.orderPart = orderPart;
        this.dish_name = dish_name;
    }
}
