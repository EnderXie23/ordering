package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*

case class QueryRejectLogMessagePlanner(dishName: String, orderID: String, orderPart: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    // Define the SQL query to fetch orders
    val jsonResultsIO = readDBRows(s"SELECT reason FROM chef.reject_log WHERE dish_name = ? AND orderid = ? AND orderpart = ?",
      List(
        SqlParameter("String", dishName),
        SqlParameter("String", orderID),
        SqlParameter("String", orderPart)
      )
    )

    // Convert the JSON results to a list of tuples
    jsonResultsIO.map {
      case head :: _ => // If there is at least one result
        head.hcursor.get[String]("reason").getOrElse("Unreadable reason.")
      case Nil => // If no results
        "No reason found."
    }
  }
}
