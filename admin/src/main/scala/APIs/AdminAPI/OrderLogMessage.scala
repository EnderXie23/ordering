package APIs.AdminAPI

case class OrderLogMessage(OrderID:String, OrderPart:String, ChefName: String, CustomerName: String, DishName: String, DishCount: String, State: String) extends AdminMessage[String]
