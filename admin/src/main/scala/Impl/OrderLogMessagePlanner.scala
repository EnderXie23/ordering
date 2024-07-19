package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.generic.auto.*
import Impl.FinishState.{fromString, ToString}
import Impl.FinishState

case class OrderLogMessagePlanner(log: LogInfo, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    startTransaction { // <-- Added transaction management
      for {
        // Validate inputs
        _ <- validateInputs(log.orderid, log.orderPart, log.userName, log.chefName, log.dishName, log.quantity, log.price, log.takeaway)
        // Insert record into database
        _ <- {
          val query = s"INSERT INTO admin.admin_log (orderID, orderPart, user_name, chef_name, dish_name, quantity, price, takeaway, state, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
          val params = List(
            SqlParameter("String", log.orderid),
            SqlParameter("String", log.orderPart),
            SqlParameter("String", log.userName),
            SqlParameter("String", log.chefName),
            SqlParameter("String", log.dishName),
            SqlParameter("String", log.quantity),
            SqlParameter("String", log.price),
            SqlParameter("String", log.takeaway),
            SqlParameter("String", ToString(log.state)),
            SqlParameter("String", log.takeaway)
          )
          writeDB(query, params).handleErrorWith { error =>
            IO.raiseError(new Exception(s"Failed to log dish record: ${error.getMessage}"))
          }
        }
      } yield "LogMessage successful" // <-- Indicate success message
    }
  }

  private def validateInputs(orderID: String, orderPart: String, customerName: String, chefName: String, dishName: String, orderCount: String, price: String, takeaway: String): IO[Unit] = IO {
    require(orderID.nonEmpty, "OrderID must not be empty")
    require(orderPart.nonEmpty, "OrderPart must not be empty")
    require(customerName.nonEmpty, "CustomerName must not be empty")
    require(dishName.nonEmpty, "DishName must not be empty")
    require(orderCount.toInt > 0, "OrderCount must be greater than zero")
    require(price.toDouble > 0, "Price must be greater than zero")
    require(takeaway.nonEmpty, "Takeaway must not be empty")
  }
}
