import { ChefMessage } from 'Plugins/ChefAPI/ChefMessage'

export class LogMessage extends ChefMessage {
    log: string;

    constructor(log: string) {
        super();
        this.log = log;
    }
}