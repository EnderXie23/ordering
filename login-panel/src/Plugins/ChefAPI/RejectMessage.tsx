import { ChefMessage } from 'Plugins/ChefAPI/ChefMessage'

interface RejectDesp {
    customerName: string;
    chefName: string;
    dishName: string;
    orderCount: string;
    orderID: string;
    orderPart: string;
    reason: string;
}

export class RejectMessage extends ChefMessage {
    rejectDesp: RejectDesp

    constructor(rejectDesp: RejectDesp) {
        super();
        this.rejectDesp = rejectDesp;
    }
}