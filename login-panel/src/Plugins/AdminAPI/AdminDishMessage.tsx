import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage'

export class DishQueryMessage extends AdminMessage {
    constructor() {
        super();
    }
}

export class DishChangeMessage extends AdminMessage {
    userName: string;

    constructor(userName: string) {
        super();
        this.userName = userName;
    }
}

