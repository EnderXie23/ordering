package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*


case class LogMessagePlanner(log: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // Function to split the log message and assign to variables
    def parseLog(log: String): Option[(String, String, String, String, String, String, String)] = {
      val parts = log.split("\n")
      if (parts.length == 7) {
        val ChefName = parts(0)
        val CustomerName = parts(1)
        val DishName = parts(2)
        val OrderCount = parts(3)
        val State = parts(4)
        val OrderID = parts(5)
        val OrderPart = parts(6)
        Some((ChefName, CustomerName, DishName, OrderCount, State, OrderID, OrderPart))
      } else {
        None // Handle case where log does not contain exactly 7 parts
      }
    }

    // Parse the log message
    val parsedLog = parseLog(log)

    parsedLog match {
      case Some((chefName, customerName, dishName, orderCount, state, orderID, orderPart)) =>
        // Start transaction
        startTransaction { // <-- Added transaction management
          for {
            // Validate inputs
            _ <- validateInputs(chefName, customerName, dishName, orderCount, state, orderID, orderPart) // <-- Ensure validation happens within transaction
            // Insert record into database
            _ <- {
              // Update chef.chef_log
              val query = s"INSERT INTO $schemaName.chef_log (chef_name, customer_name, dish_name, quantity, state) VALUES (?, ?, ?, ?, ?)"
              val params = List(
                SqlParameter("String", chefName),
                SqlParameter("String", customerName),
                SqlParameter("String", dishName),
                SqlParameter("String", orderCount),
                SqlParameter("String", if state == "1" then "done" else "rejected"),
              )
              writeDB(query, params).handleErrorWith { error =>
                IO.raiseError(new Exception(s"Failed to log dish record: ${error.getMessage}"))
              }
            }
            _ <- {
              // Update admin.admin_log
              val query2 = """UPDATE admin.admin_log
                    SET chef_name = ?,
                    state = ?
                    WHERE user_name = ?
                    AND orderid = ?
                    AND orderpart = ?
                    AND dish_name = ?
              """
              val params2 = List(
                SqlParameter("String", chefName),
                SqlParameter("String", if state == "1" then "done" else "rejected"),
                SqlParameter("String", customerName),
                SqlParameter("String", orderID),
                SqlParameter("String", orderPart),
                SqlParameter("String", dishName)
              )
              writeDB(query2, params2).handleErrorWith { error =>
                IO.raiseError(new Exception(s"Failed to log dish record: ${error.getMessage}"))
              }
            }
          } yield "RecordMessage successful" // <-- Indicate success message
        }
      case None =>
        IO.raiseError(new Exception("Failed to parse the log message"))
    }
  }

  private def validateInputs(chefName: String, customerName: String, dishName: String, orderCount: String, state: String, OrderID: String, OrderPart: String): IO[Unit] = IO {
    require(chefName.nonEmpty, "ChefName must not be empty")
    require(customerName.nonEmpty, "CustomerName must not be empty")
    require(dishName.nonEmpty, "DishName must not be empty")
    require(orderCount.toInt > 0, "OrderCount must be greater than zero")
    require(state.nonEmpty, "State must not be empty")
    require(OrderID.nonEmpty, "OrderID must not be empty")
    require(OrderPart.nonEmpty, "OrderPart must not be empty")
  }
}


