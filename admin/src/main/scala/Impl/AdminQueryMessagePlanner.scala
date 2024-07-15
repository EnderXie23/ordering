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

case class AdminQueryMessagePlanner(override val planContext: PlanContext) extends Planner[List[LogInfo]] {
  override def plan(using PlanContext): IO[List[LogInfo]] = {
    // Define the SQL query to fetch orders
    val sqlQuery = s"SELECT chef_name, user_name, dish_name, quantity, price, state, orderid, orderpart, takeaway, rating FROM ${schemaName}.admin_log"
    val jsonResultsIO: IO[List[Json]] = readDBRows(sqlQuery, List.empty)

    // Convert the JSON results to a list of tuples
    val results: IO[List[LogInfo]] = jsonResultsIO.map { jsonResults =>
      jsonResults.map { jsonResult =>
        val cursor = jsonResult.hcursor
        LogInfo(
          cursor.downField("orderid").as[String].getOrElse("Unknown OrderID"),
          cursor.downField("orderpart").as[String].getOrElse("Unknown OrderPart"),
          cursor.downField("userName").as[String].getOrElse("Unknown User"),
          cursor.downField("chefName").as[String].getOrElse("Unknown Chef"),
          cursor.downField("dishName").as[String].getOrElse("Unknown Dish"),
          cursor.downField("quantity").as[String].getOrElse("N/A"),
          cursor.downField("price").as[String].getOrElse("N/A"),
          cursor.downField("takeaway").as[String].getOrElse("N/A"),
          cursor.downField("state").as[String].getOrElse("N/A"),
          cursor.downField("rating").as[String].getOrElse("N/A")
        )
      }.filter { result => result.state != "2" }
    }

    results
  }
}
