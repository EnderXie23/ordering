package APIs.ChefAPI

case class LogMessage(ChefName: String, CustomerName: String, DishName: String, DishQuantity: String, State: String) extends ChefMessage[Int]
