import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage'

interface LogInfo {
    orderid: string,
    orderPart: string,
    userName: string,
    chefName: string,
    dishName: string,
    quantity: string,
    price: string,
    takeaway: string,
    state: string,
    rating: string
}

export class OrderLogMessage extends AdminMessage {
    log: LogInfo;

    constructor(log: LogInfo) {
        super();
        this.log = log;
    }
}