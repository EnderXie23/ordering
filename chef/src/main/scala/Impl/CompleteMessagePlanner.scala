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

case class CompleteMessagePlanner(orderdesp: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    // Split orderdesp into individual components
    val Array(customerName, dishName, orderCount, state, orderID, orderPart) = orderdesp.split("\n")

    // Define the SQL query to fetch orders
    val sqlUpdateQuery = s"""
      UPDATE customer.order_rec
      SET finish_state = ?
      WHERE customer_name = ?
      AND dish_name = ?
      AND order_count = ?
      AND orderid = ?
      AND orderpart = ?
    """

    // Execute the SQL query
    writeDB(sqlUpdateQuery, List(
      SqlParameter("String", if (state == "1") "done" else "rejected"),
      SqlParameter("String", customerName),
      SqlParameter("String", dishName),
      SqlParameter("String", orderCount),
      SqlParameter("String", orderID),
      SqlParameter("String", orderPart)
    )).map(_ => "Complete dish successfully.")
  }
}