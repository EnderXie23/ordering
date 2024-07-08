package APIs.CustomerAPI

case class CustomerRegisterMessage(userName:String) extends CustomerMessage[Int]
