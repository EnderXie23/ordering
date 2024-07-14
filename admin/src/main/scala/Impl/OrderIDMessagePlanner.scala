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
        SELECT orderID, user_name, chef_name, dish_name, quantity, state
        FROM admin.admin_log
        WHERE user_name = '0' AND chef_name = 'admin' AND dish_name = '0' AND quantity = '0' AND state = '2'
      """

    val jsonResultsIO: IO[List[Json]] = readDBRows(sqlQuery, List.empty)

    // Convert the JSON results to a list of tuples
    val results: IO[List[(String, String, String, String, String, String)]] = jsonResultsIO.map { jsonResults =>
      jsonResults.map { jsonResult =>
        val orderID = jsonResult.hcursor.downField("orderid").as[String].getOrElse("Unknown OrderID")
        val userName = jsonResult.hcursor.downField("user_name").as[String].getOrElse("Unknown User")
        val chefName = jsonResult.hcursor.downField("chef_name").as[String].getOrElse("Unknown Chef")
        val dishName = jsonResult.hcursor.downField("dish_name").as[String].getOrElse("Unknown Dish")
        val quantity = jsonResult.hcursor.downField("quantity").as[String].getOrElse("Unknown Quantity")
        val state = jsonResult.hcursor.downField("state").as[String].getOrElse("Unknown State")
        (orderID, userName, chefName, dishName, quantity, state)
      }
    }

    // Generate the formatted string
    val formattedResults: IO[String] = results.map { resultsList =>
      resultsList.map { case (orderID, userName, chefName, dishName, quantity, state) =>
        s"$orderID"
      }.mkString("\n")
    }

    // Update the order IDs in the database
    val updateActions: IO[List[String]] = results.flatMap { resultsList =>
      val actions = resultsList.map { case (orderID, _, _, _, _, _) =>
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
