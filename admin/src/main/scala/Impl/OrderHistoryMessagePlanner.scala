package Impl

import APIs.AdminAPI.OrderLogMessage
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*


case class OrderHistoryMessagePlanner(log: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // Function to split the log message and assign to variables
    def parseLog(log: String): Option[(String, String, String, String, String, String, String, String, String)] = {
      val parts = log.split("\n")
      if (parts.length == 9) {
        val OrderID = parts(0)
        val OrderPart = parts(1)
        val CustomerName = parts(2)
        val ChefName = parts(3)
        val DishName = parts(4)
        val OrderCount = parts(5)
        val Price = parts(6)
        val takeaway = parts(7)
        val State = parts(8)
        Some((OrderID, OrderPart, CustomerName, ChefName, DishName, OrderCount, Price, takeaway, State))
      } else {
        None // Handle case where log does not contain exactly 8 parts
      }
    }

    // Parse the log message
    val parsedLog = parseLog(log)
    parsedLog match {
      case Some((orderID, orderPart, customerName, chefName, dishName, orderCount, price, takeaway, state)) =>
        // Start transaction
        startTransaction { // <-- Added transaction management
          for {
            // Validate inputs
            _ <- validateInputs(orderID, orderPart, customerName, chefName, dishName, orderCount, price, takeaway, state) // <-- Ensure validation happens within transaction
            // Insert record into database
            _ <- {
              val query = s"INSERT INTO admin.admin_log (orderID, orderPart, user_name, chef_name, dish_name, quantity, price, takeaway, state, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
              val params = List(
                SqlParameter("String", orderID),
                SqlParameter("String", orderPart),
                SqlParameter("String", customerName),
                SqlParameter("String", chefName),
                SqlParameter("String", dishName),
                SqlParameter("String", orderCount),
                SqlParameter("String", price),
                SqlParameter("String", takeaway),
                SqlParameter("String", if state == "1" then "done" else if state == "3" then "processing" else "rejected"),
                SqlParameter("String", "0")
              )
              writeDB(query, params).handleErrorWith { error =>
                IO.raiseError(new Exception(s"Failed to log dish record: ${error.getMessage}"))
              }
            }
          } yield "LogMessage successful" // <-- Indicate success message
        }
      case None =>
        IO.raiseError(new Exception("Failed to parse the log message"))
    }
  }

  private def validateInputs(orderID: String, orderPart: String, customerName: String, chefName: String, dishName: String, orderCount: String, price: String, takeaway: String, state: String): IO[Unit] = IO {
    require(orderID.nonEmpty, "OrderID must not be empty")
    require(orderPart.nonEmpty, "OrderPart must not be empty")
    require(customerName.nonEmpty, "CustomerName must not be empty")
    require(chefName.nonEmpty, "ChefName must not be empty")
    require(dishName.nonEmpty, "DishName must not be empty")
    require(orderCount.toInt > 0, "OrderCount must be greater than zero")
    require(price.toDouble > 0, "Price must be greater than zero")
    require(takeaway.nonEmpty, "Takeaway must not be empty")
    require(state.nonEmpty, "State must not be empty")
  }
}
