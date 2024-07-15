package Impl

import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName

case class CustomerHistoryMessagePlanner(userName: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {

    // Define the SQL query to fetch orders for the specific user
    val sqlQuery = s"SELECT orderID, orderPart, dish_name, order_count, price, finish_state FROM ${schemaName}.order_rec WHERE customer_name = ?"
    val parameters = List(SqlParameter("string", userName))
    val jsonResultsIO: IO[List[Json]] = readDBRows(sqlQuery, parameters)

    // Convert the JSON results to a list of tuples
    val results: IO[List[(String, String, String, String, String, String)]] = jsonResultsIO.map { jsonResults =>
      jsonResults.map { jsonResult =>
        val orderID = jsonResult.hcursor.downField("orderid").as[String].getOrElse("N/A")
        val orderPart = jsonResult.hcursor.downField("orderpart").as[String].getOrElse("N/A")
        val dishName = jsonResult.hcursor.downField("dishName").as[String].getOrElse("Unknown Dish")
        val orderCount = jsonResult.hcursor.downField("orderCount").as[String].getOrElse("N/A")
        val price = jsonResult.hcursor.downField("price").as[String].getOrElse("N/A")
        val finishState = jsonResult.hcursor.downField("finishState").as[String].getOrElse("N/A")
        (dishName, orderCount, price, finishState, orderID, orderPart)
      }
    }

    // Convert the list of tuples to a formatted string
    results.map { resultsList =>
      resultsList
        .filter { case (_, _, _, finishState,_,_) => finishState != "2" }
        .map { case (dishName, orderCount, price, finishState, orderID,orderPart) =>
          s"Dish:$dishName,Order Count:$orderCount,Price:$price,State:$finishState,OrderID:$orderID,OrderPart:$orderPart"
        }
        .mkString("\n")
    }
  }
