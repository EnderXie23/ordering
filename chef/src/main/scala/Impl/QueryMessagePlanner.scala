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

case class QueryMessagePlanner(override val planContext: PlanContext) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    // Define the SQL query to fetch orders
    val sqlQuery = s"SELECT customer_name, orderID, orderpart, dish_name, order_count, finish_state FROM customer.order_rec"

    // Execute the query and get the results as JSON
    val jsonResultsIO: IO[List[Json]] = readDBRows(sqlQuery, List.empty)

    // Convert the JSON results to a list of tuples
    val results: IO[List[(String, String, String, String, String, String)]] = jsonResultsIO.map { jsonResults =>
      jsonResults.map { jsonResult =>
        val customerName = jsonResult.hcursor.downField("customerName").as[String].getOrElse("Unknown Customer")
        val orderID = jsonResult.hcursor.downField("orderid").as[String].getOrElse("Unknown OrderID")
        val orderPart = jsonResult.hcursor.downField("orderpart").as[String].getOrElse("Unknown OrderPart")
        val dishName = jsonResult.hcursor.downField("dishName").as[String].getOrElse("Unknown Dish")
        val orderCount = jsonResult.hcursor.downField("orderCount").as[String].getOrElse("N/A")
        val finishState = jsonResult.hcursor.downField("finishState").as[String].getOrElse("N/A")
        (customerName, orderID, orderPart, dishName, orderCount, finishState)
      }
    }

    // Convert the list of tuples to a formatted string
    results.map { resultsList =>
      resultsList.map { case (customerName, orderID, orderPart, dishName, orderCount, finishState) =>
        s"Customer: $customerName\nOrderID: $orderID\nOrderPart: $orderPart\nDish: $dishName\nOrder Count: $orderCount\nState: $finishState\n"
      }.mkString("\n")
    }
  }
}