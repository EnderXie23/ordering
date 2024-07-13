import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage'

export class OrderLogMessage extends AdminMessage {
    log: string;

    constructor(log: string) {
        super();
        this.log = log;
    }
}