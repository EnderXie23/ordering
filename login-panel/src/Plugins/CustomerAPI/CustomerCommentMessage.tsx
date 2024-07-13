import { CustomerMessage } from 'Plugins/CustomerAPI/CustomerMessage'

export class CustomerCommentMessage extends CustomerMessage {
    customerName: string;
    chefName: string;
    comment: string;
    overall: string;
    taste: string;
    pack: string;
    serv: string;
    env: string;

    constructor(customerName: string,chefName: string , comment: string, overall: string, taste: string, pack: string, serv: string, env: string) {
        super();
        this.customerName = customerName;
        this.chefName = chefName;
        this.comment = comment;
        this.overall = overall;
        this.taste = taste;
        this.pack= pack;
        this.serv = serv;
        this.env = env;
    }
}
