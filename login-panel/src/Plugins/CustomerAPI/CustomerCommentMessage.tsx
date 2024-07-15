import { CustomerMessage } from 'Plugins/CustomerAPI/CustomerMessage'

interface Comment {
    customerName: string,
    chefName: string,
    comment: string,
    overall: string,
    taste: string,
    pack: string,
    serv: string,
    env: string
}

export class CustomerCommentMessage extends CustomerMessage {
    comment: Comment;

    constructor(comment: Comment) {
        super();
        this.comment = comment;
    }
}
