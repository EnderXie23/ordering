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
    val sqlQuery = s"SELECT chef_name, user_name, dish_name, quantity, price, state, orderID, orderPart, rating FROM ${schemaName}.admin_log"
    val jsonResultsIO: IO[List[Json]] = readDBRows(sqlQuery, List.empty)

    // Convert the JSON results to a list of tuples
    val results: IO[List[(Option[String], String, String, String, String, String, String, String, String)]] = jsonResultsIO.map { jsonResults =>
      jsonResults.map { jsonResult =>
        val orderID = jsonResult.hcursor.downField("orderid").as[String].getOrElse("N/A")
        val orderPart = jsonResult.hcursor.downField("orderpart").as[String].getOrElse("N/A")
        val chefNameRaw = jsonResult.hcursor.downField("chefName").as[String].getOrElse("Unknown Chef")
        val chefName = if (chefNameRaw == "admin") None else Some(chefNameRaw)
        val customerName = jsonResult.hcursor.downField("userName").as[String].getOrElse("Unknown Customer")
        val dishName = jsonResult.hcursor.downField("dishName").as[String].getOrElse("Unknown Dish")
        val orderCount = jsonResult.hcursor.downField("quantity").as[String].getOrElse("N/A")
        val price = jsonResult.hcursor.downField("price").as[String].getOrElse("N/A")
        val finishState = jsonResult.hcursor.downField("state").as[String].getOrElse("N/A")
        val rating = jsonResult.hcursor.downField("rating").as[String].getOrElse("N/A")
        (chefName, customerName, dishName, orderCount, price, finishState, orderID, orderPart, rating)
      }
    }

    // Convert the list of tuples to a formatted string
    results.map { resultsList =>
      resultsList
        .filter { case (_, _, _, _, _, finishState, _, _, _) => finishState != "2" }
        .map { case (chefName, customerName, dishName, orderCount, price, finishState, orderID, orderPart, rating) =>
          s"Chef:$chefName,Customer:$customerName,Dish:$dishName,Order Count:$orderCount,Price:$price,State:$finishState,OrderID:$orderID,OrderPart:$orderPart,Rating:$rating"
        }
        .mkString("\n")
    }
  }
}
