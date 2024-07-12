import { AdminMessage } from 'Plugins/AdminAPI/AdminMessage'

export class DishQueryMessage extends AdminMessage {
    constructor() {
        super();
    }
}

export class DishChangeMessage extends AdminMessage {
    name: string;
    imgPath: string;
    price: string;

    constructor(name: string, imgPath: string, price: string) {
        super();
        this.name = name;
        this.imgPath = imgPath;
        this.price = price;
    }
}

