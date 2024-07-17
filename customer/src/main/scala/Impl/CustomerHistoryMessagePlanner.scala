package Impl

import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import Impl.FinishState

case class CustomerHistoryMessagePlanner(userName: String, override val planContext: PlanContext) extends Planner[List[UserHistory]]:
  override def plan(using PlanContext): IO[List[UserHistory]] = {

    // Define the SQL query to fetch orders for the specific user
    val sqlQuery = s"SELECT orderID, orderPart, dish_name, order_count, price, finish_state FROM ${schemaName}.order_rec WHERE customer_name = ?"
    val parameters = List(SqlParameter("string", userName))
    val jsonResultsIO: IO[List[Json]] = readDBRows(sqlQuery, parameters)

    // Convert the JSON results to a list of tuples
    val results: IO[List[UserHistory]] = jsonResultsIO.map { jsonResults =>
      jsonResults.map { jsonResult =>
        UserHistory(
          jsonResult.hcursor.downField("orderid").as[String].getOrElse("N/A"),
          jsonResult.hcursor.downField("orderpart").as[String].getOrElse("N/A"),
          jsonResult.hcursor.downField("dishName").as[String].getOrElse("Unknown Dish"),
          jsonResult.hcursor.downField("orderCount").as[Int].getOrElse(-1),
          jsonResult.hcursor.downField("price").as[Int].getOrElse(-1),
          FinishState.fromString(jsonResult.hcursor.downField("finishState").as[String].getOrElse("Unknown"))

        )
      }
    }
      results
  }