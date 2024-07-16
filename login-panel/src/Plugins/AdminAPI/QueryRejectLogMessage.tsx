import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage'

export class QueryRejectLogMessage extends AdminMessage {
    dishName: string;
    orderID: string;
    orderPart: string;

    constructor(dishName: string, orderID: string, orderPart: string) {
        super();
        this.dishName = dishName;
        this.orderID = orderID;
        this.orderPart = orderPart;
    }
}
