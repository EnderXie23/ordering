import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage'
import { FinishState } from 'Pages/enums'

interface LogInfo {
    orderid: string,
    orderPart: string,
    userName: string,
    chefName: string,
    dishName: string,
    quantity: string,
    price: string,
    takeaway: string,
    state: FinishState,
    rating: string
}

export class OrderLogMessage extends AdminMessage {
    log: LogInfo;

    constructor(log: LogInfo) {
        super();
        this.log = log;
    }
}