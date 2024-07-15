import { ChefMessage } from 'Plugins/ChefAPI/ChefMessage'

interface OrderDesp {
    customerName: string;
    chefName: string;
    dishName: string;
    orderCount: string;
    state: string;
    orderID: string;
    orderPart: string;
}

export class CompleteMessage extends ChefMessage {
    orderDesp: OrderDesp

    constructor(orderDesp: OrderDesp) {
        super();
        this.orderDesp = orderDesp;
    }
}