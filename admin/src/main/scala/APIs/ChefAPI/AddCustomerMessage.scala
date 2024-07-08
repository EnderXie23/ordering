package APIs.ChefAPI

case class AddCustomerMessage(chefName:String, customerName:String) extends ChefMessage[String]
