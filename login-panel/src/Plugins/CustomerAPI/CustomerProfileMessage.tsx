import { CustomerMessage } from 'Plugins/CustomerAPI/CustomerMessage'

export class CustomerChangePwdMessage extends CustomerMessage {
    userName: string;
    old_password: string;
    new_password: string;

    constructor(userName: string, old_password: string, new_password: string) {
        super();
        this.userName = userName;
        this.old_password = old_password;
        this.new_password = new_password;
    }
}

export class CustomerQueryProfileMessage extends CustomerMessage {
    userName: string;

    constructor(userName: string) {
        super();
        this.userName = userName;
    }
}

export class CustomerChargeMessage extends CustomerMessage {
    userName: string;
    amount: string;

    constructor(userName: string, amount: string) {
        super();
        this.userName = userName;
        this.amount = amount;
    }
}
