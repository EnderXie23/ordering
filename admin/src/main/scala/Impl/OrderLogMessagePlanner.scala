package Impl

import Common.API.{PlanContext, Planner}
import cats.effect.IO
import io.circe.Json
import cats.effect.IO
import io.circe.generic.auto.*
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import APIs.AdminAPI.OrderLogMessage


case class OrderLogMessagePlanner(log: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // Function to split the log message and assign to variables
    def parseLog(log: String): Option[(String, String, String, String, String, String, String, String)] = {
      val parts = log.split("\n")
      if (parts.length == 8) {
        val OrderID = parts(0)
        val OrderPart = parts(1)
        val CustomerName = parts(2)
        val DishName = parts(3)
        val OrderCount = parts(4)
        val Price = parts(5)
        val takeaway = parts(6)
        val State = parts(7)
        Some((OrderID, OrderPart, CustomerName, DishName, OrderCount, Price, takeaway, State))
      } else {
        None // Handle case where log does not contain exactly 8 parts
      }
    }

    // Parse the log message
    val parsedLog = parseLog(log)
    parsedLog match {
      case Some((orderID, orderPart, customerName, dishName, orderCount, price, takeaway, state)) =>
        // Start transaction
        startTransaction { // <-- Added transaction management
          for {
            // Validate inputs
            _ <- validateInputs(orderID, orderPart, customerName, "", dishName, orderCount, price, takeaway, state) // <-- Ensure validation happens within transaction
            // Insert record into database
            _ <- {
              val query = s"INSERT INTO admin.admin_log (orderID, orderPart, user_name, chef_name, dish_name, quantity, price, takeaway, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
              val params = List(
                SqlParameter("String", orderID),
                SqlParameter("String", orderPart),
                SqlParameter("String", customerName),
                SqlParameter("String", ""),
                SqlParameter("String", dishName),
                SqlParameter("String", orderCount),
                SqlParameter("String", price),
                SqlParameter("String", takeaway),
                SqlParameter("String", if state == "1" then "done" else if state == "3" then "processing" else "rejected")
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
    require(dishName.nonEmpty, "DishName must not be empty")
    require(orderCount.toInt > 0, "OrderCount must be greater than zero")
    require(price.toDouble > 0, "Price must be greater than zero")
    require(takeaway.nonEmpty, "Takeaway must not be empty")
    require(state.nonEmpty, "State must not be empty")
  }
}
