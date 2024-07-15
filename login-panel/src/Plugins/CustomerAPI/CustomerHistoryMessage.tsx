import { CustomerMessage } from 'Plugins/CustomerAPI/CustomerMessage'

export class CustomerHistoryMessage extends CustomerMessage {
    userName:string
    constructor(username:string) {
        super();
        this.userName = username;
    }
}