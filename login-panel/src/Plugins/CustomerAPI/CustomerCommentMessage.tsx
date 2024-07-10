import { CustomerMessage } from 'Plugins/CustomerAPI/CustomerMessage'

export class CustomerCommentMessage extends CustomerMessage {
    customerName: string;
    comment: string;
    overall: string;
    taste: string;
    pack: string;
    serv: string;
    env: string;

    constructor(customerName: string, comment: string, overall: string, taste: string, pack: string, serv: string, env: string) {
        super();
        this.customerName = customerName;
        this.comment = comment;
        this.overall = overall;
        this.taste = taste;
        this.pack= pack;
        this.serv = serv;
        this.env = env;
    }
}
