import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage'

export class OrderIDMessage extends AdminMessage {
    OrderID: string;

    constructor(OrderID: string) {
        super();
        this.OrderID = OrderID;
    }
}