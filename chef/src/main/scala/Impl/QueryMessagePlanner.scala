package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*

case class QueryMessagePlanner(override val planContext: PlanContext) extends Planner[List[OrderDesp]] {
  override def plan(using PlanContext): IO[List[OrderDesp]] = {
    // Define the SQL query to fetch ordersList
    val sqlQuery = s"SELECT customer_name, orderid, orderpart, dish_name, order_count, finish_state FROM customer.order_rec"

    // Execute the query and get the results as JSON
    val jsonResultsIO: IO[List[Json]] = readDBRows(sqlQuery, List.empty)

    // Convert the JSON results to a list of OrderDesps
    val results: IO[List[OrderDesp]] = jsonResultsIO.map { jsonResults =>
      jsonResults.map { jsonResult =>
        val cursor = jsonResult.hcursor
        OrderDesp(
          cursor.downField("customerName").as[String].getOrElse("Unknown Customer"),
          "",
          cursor.downField("dishName").as[String].getOrElse("Unknown Dish"),
          cursor.downField("orderCount").as[String].getOrElse("N/A"),
          cursor.downField("finishState").as[String].getOrElse("N/A"),
          cursor.downField("orderid").as[String].getOrElse("Unknown OrderID"),
          cursor.downField("orderpart").as[String].getOrElse("Unknown OrderPart")
        )
      }
    }
    
    results
  }
}