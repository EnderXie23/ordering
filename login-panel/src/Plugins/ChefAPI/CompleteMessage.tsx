import { ChefMessage } from 'Plugins/ChefAPI/ChefMessage'

export class CompleteMessage extends ChefMessage {
    orderdesp: string;

    constructor(orderdesp: string) {
        super();
        this.orderdesp = orderdesp;
    }
}