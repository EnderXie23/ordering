package APIs.CustomerAPI

case class CustomerLoginMessage(userName:String, password:String) extends CustomerMessage[String]
