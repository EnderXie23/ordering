import { CustomerMessage } from 'Plugins/CustomerAPI/CustomerMessage'

export class CustomerRegisterMessage extends CustomerMessage {
    userName: string;
    password: string;
    nickname: string;
    phone: string;

    constructor(userName: string, password: string, nickname: string, phone: string) {
        super();
        this.userName = userName;
        this.password = password;
        this.nickname = nickname;
        this.phone = phone;
    }
}
