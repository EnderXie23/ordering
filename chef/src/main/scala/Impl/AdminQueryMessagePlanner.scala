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

case class AdminQueryMessagePlanner(override val planContext: PlanContext) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    // Define the SQL query to fetch orders
    val sqlQuery = s"SELECT chef_name, customer_name, dish_name, quantity, state FROM chef.chef_log"
    val jsonResultsIO: IO[List[Json]] = readDBRows(sqlQuery, List.empty)

    // Convert the JSON results to a list of tuples
    val results: IO[List[(String, String, String, String, String)]] = jsonResultsIO.map { jsonResults =>
      jsonResults.map { jsonResult =>
        val chefName = jsonResult.hcursor.downField("chefName").as[String].getOrElse("Unknown Chef")
        val customerName = jsonResult.hcursor.downField("customerName").as[String].getOrElse("Unknown Customer")
        val dishName = jsonResult.hcursor.downField("dishName").as[String].getOrElse("Unknown Dish")
        val orderCount = jsonResult.hcursor.downField("quantity").as[String].getOrElse("N/A")
        val finishState = jsonResult.hcursor.downField("state").as[String].getOrElse("N/A")
        (chefName, customerName, dishName, orderCount, finishState)
      }
    }

    // Convert the list of tuples to a formatted string
    results.map { resultsList =>
      resultsList.map { case (chefName, customerName, dishName, orderCount, finishState) =>
        s"Chef: $chefName\nCustomer: $customerName\nDish: $dishName\nOrder Count: $orderCount\nState: $finishState\n"
      }.mkString("\n")
    }
  }
}
