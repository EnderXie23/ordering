import { ChefMessage } from 'Plugins/ChefAPI/ChefMessage'

export class QueryMessage extends ChefMessage {
    userName: string;

    constructor(userName: string) {
        super();
        this.userName = userName;
    }
}