import { ChefMessage } from 'Plugins/ChefAPI/ChefMessage'

export class RegisterMessage extends ChefMessage {
    userName: string;
    password: string;

    constructor(userName: string, password: string) {
        super();
        this.userName = userName;
        this.password = password;
    }
}