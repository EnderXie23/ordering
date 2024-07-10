package APIs.CustomerAPI

case class CustomerCommentMessage(customerName:String, comment: String, overall: String, taste: String, pack: String, serv: String, env: String) extends CustomerMessage[String]
