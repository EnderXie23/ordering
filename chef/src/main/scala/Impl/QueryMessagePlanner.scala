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
    val sqlQuery = s"SELECT customer_name, dish_name, order_count FROM customer.order_rec"

    // Execute the query and get the results as JSON
    val jsonResultsIO: IO[List[Json]] = readDBRows(sqlQuery, List.empty)

    // Convert the JSON results to a list of tuples
    val results: IO[List[(String, String, String)]] = jsonResultsIO.map { jsonResults =>
      jsonResults.map { jsonResult =>
        val customerName = jsonResult.hcursor.downField("customerName").as[String].getOrElse("Unknown Customer")
        val dishName = jsonResult.hcursor.downField("dishName").as[String].getOrElse("Unknown Dish")
        val orderCount = jsonResult.hcursor.downField("orderCount").as[String].getOrElse("N/A")
        (customerName, dishName, orderCount)
      }
    }

    // Convert the list of tuples to a formatted string
    results.map { resultsList =>
      resultsList.map { case (customerName, dishName, orderCount) =>
        s"Customer: $customerName\nDish: $dishName\nOrder Count: $orderCount"
      }.mkString("\n")
    }
  }
}