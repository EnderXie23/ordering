package APIs.ChefAPI

case class LoginMessage(userName:String, password:String) extends ChefMessage[String]
