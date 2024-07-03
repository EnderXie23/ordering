import { ChefMessage } from 'Plugins/ChefAPI/ChefMessage'

export class AddCustomerMessage extends ChefMessage{
    chefName: string;
    customerName: string;

    constructor(chefName:string, customerName:string) {
        super();
        this.chefName = chefName;
        this.customerName = customerName;
    }
}
