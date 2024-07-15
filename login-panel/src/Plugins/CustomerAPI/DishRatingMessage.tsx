import { CustomerMessage } from 'Plugins/CustomerAPI/CustomerMessage'

export class DishRatingMessage extends CustomerMessage {
    orderID: string;
    dishName: string;
    rating: string;

    constructor(orderID: string, dishName: string, rating: string) {
        super()
        this.orderID = orderID;
        this.dishName = dishName;
        this.rating = rating;
    }
}
