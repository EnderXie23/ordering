package Impl

import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import APIs.CustomerAPI.CustomerQueryMessage
import cats.effect.IO
import io.circe.generic.auto.*

case class CustomerOrderIDMessagePlanner(OrderID:String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    // Define the SQL query to fetch orders with specific data content
    val sqlQuery =
      s"""
        SELECT order_id, user_name, chef_name, dish_name, quantity, state
        FROM chef.chef_log
        WHERE user_name = '0' AND chef_name = '0' AND dish_name = '0' AND quantity = '0' AND state = '0'
      """

    val jsonResultsIO: IO[List[Json]] = readDBRows(sqlQuery, List.empty)

    // Convert the JSON results to a list of tuples
    val results: IO[List[(String, String, String, String, String, String)]] = jsonResultsIO.map { jsonResults =>
      jsonResults.map { jsonResult =>
        val orderID = jsonResult.hcursor.downField("order_id").as[String].getOrElse("Unknown OrderID")
        val userName = jsonResult.hcursor.downField("user_name").as[String].getOrElse("Unknown User")
        val chefName = jsonResult.hcursor.downField("chef_name").as[String].getOrElse("Unknown Chef")
        val dishName = jsonResult.hcursor.downField("dish_name").as[String].getOrElse("Unknown Dish")
        val quantity = jsonResult.hcursor.downField("quantity").as[String].getOrElse("Unknown Quantity")
        val state = jsonResult.hcursor.downField("state").as[String].getOrElse("Unknown State")
        (orderID, userName, chefName, dishName, quantity, state)
      }
    }

    // Convert the list of tuples to a formatted string
    results.map { resultsList =>
      resultsList.map { case (orderID, userName, chefName, dishName, quantity, state) =>
        s"Order ID: $orderID\nUser Name: $userName\nChef Name: $chefName\nDish Name: $dishName\nQuantity: $quantity\nState: $state\n"
      }.mkString("\n")
    }
  }
}
