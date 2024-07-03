import { CustomerMessage } from 'Plugins/CustomerAPI/CustomerMessage'

export class CustomerRegisterMessage extends CustomerMessage {
    userName: string;
    password: string;

    constructor(userName: string, password: string) {
        super();
        this.userName = userName;
        this.password = password;
    }
}
