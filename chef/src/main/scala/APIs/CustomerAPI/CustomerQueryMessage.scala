package APIs.CustomerAPI

case class CustomerQueryMessage(chefName:String, customerName:String) extends CustomerMessage[String]
