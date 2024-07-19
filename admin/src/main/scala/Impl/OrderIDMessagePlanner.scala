package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*
import cats.implicits._

case class OrderIDMessagePlanner(override val planContext: PlanContext) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    // Define the SQL query to fetch orders with specific data content
    val sqlQuery =
      s"""
        SELECT orderID
        FROM admin.admin_log
        WHERE user_name = '0' AND chef_name = 'admin' AND dish_name = '0' AND quantity = '0' AND state = '2'
      """

    val jsonResultsIO: IO[List[Json]] = readDBRows(sqlQuery, List.empty)

    // Convert the JSON results to a list of tuples
    val results: IO[String] = jsonResultsIO.map { jsonResults =>
      // Extract orderID from each Json and combine them into a single String
      val orderIDs: List[String] = jsonResults.map { jsonResult =>
        jsonResult.hcursor.downField("orderid").as[String].getOrElse("Unknown OrderID")
      }
      orderIDs.mkString(", ") // Combine all orderIDs into a single string, separated by commas (or any other separator you prefer)
    }

    // Generate the formatted string
    val formattedResults: IO[String] = results.map { resultString =>
      // Assuming you want each orderID on a new line
      resultString.split(", ").mkString("\n")
    }

    // Update the order IDs in the database
    // Update actions
    val updateActions: IO[List[String]] = results.flatMap { resultString =>
      val orderIDs = resultString.split(", ").toList
      val actions = orderIDs.map { orderID =>
        val newOrderID: String = orderID.toIntOption.map(_ + 1).getOrElse(0).toString
        val updateQuery =
          s"""
      UPDATE admin.admin_log
      SET orderID = ?
      WHERE orderID = ?
      """
        val params = List(
          SqlParameter("String", newOrderID),
          SqlParameter("String", orderID)
        )
        writeDB(updateQuery, params)
      }
      actions.sequence
    }

    // Combine the formatted results and update actions
    for {
      formatted <- formattedResults
      _ <- updateActions
    } yield formatted
  }
}
