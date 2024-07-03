import { CustomerMessage } from 'Plugins/CustomerAPI/CustomerMessage'

export class CustomerLoginMessage extends CustomerMessage {
    userName: string;
    password: string;

    constructor(userName: string, password: string) {
        super();
        this.userName = userName;
        this.password = password;
    }
}