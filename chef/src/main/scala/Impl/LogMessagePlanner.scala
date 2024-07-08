package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import APIs.CustomerAPI.CustomerQueryMessage
import cats.effect.IO
import io.circe.generic.auto.*


case class LogMessagePlanner(log:String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // Function to split the log message and assign to variables
    def parseLog(log: String): Option[(String, String, String, String, String)] = {
      val parts = log.split("\n")
      if (parts.length == 5) {
        val ChefName = parts(0)
        val CustomerName = parts(1)
        val DishName = parts(2)
        val OrderCount = parts(3)
        val State = parts(4)
        Some((ChefName, CustomerName, DishName, OrderCount, State))
      } else {
        None // Handle case where log does not contain exactly 5 parts
      }
    }

    // Parse the log message
    val parsedLog = parseLog(log)

    parsedLog match {
      case Some((chefName, customerName, dishName, orderCount, state)) =>
        // Start transaction
        startTransaction { // <-- Added transaction management
          for {
            // Validate inputs
            _ <- validateInputs(chefName, customerName, dishName, orderCount, state) // <-- Ensure validation happens within transaction
            // Insert record into database
            _ <- {
              val query = s"INSERT INTO ${schemaName}.chef_log (chef_name, customer_name, dish_name, quantity, state) VALUES (?, ?, ?, ?, ?)"
              val params = List(
                SqlParameter("String", chefName),
                SqlParameter("String", customerName),
                SqlParameter("String", dishName),
                SqlParameter("String", orderCount),
                SqlParameter("String", state)
              )
              writeDB(query, params).handleErrorWith { error =>
                IO.raiseError(new Exception(s"Failed to log dish record: ${error.getMessage}"))
              }
            }
          } yield "RecordMessage successful" // <-- Indicate success message
        }
      case None =>
        IO.raiseError(new Exception("Failed to parse the log message"))
    }
  }

  private def validateInputs(chefName: String, customerName: String, dishName: String, orderCount: String, state: String): IO[Unit] = IO {
    require(chefName.nonEmpty, "ChefName must not be empty")
    require(customerName.nonEmpty, "CustomerName must not be empty")
    require(dishName.nonEmpty, "DishName must not be empty")
    require(orderCount.toInt > 0, "OrderCount must be greater than zero")
    require(state.nonEmpty, "State must not be empty")
  }
}


