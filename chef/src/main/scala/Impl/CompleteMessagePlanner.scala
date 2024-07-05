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
    val Array(customerName, dishName, orderCount, state) = orderdesp.split("\n")

    // Define the SQL query to fetch orders
    val sqlDeleteQuery = s"""
      DELETE FROM customer.order_rec
      WHERE ctid = (
        SELECT ctid
        FROM customer.order_rec
        WHERE customer_name = ?
        AND dish_name = ?
        AND order_count = ?
        LIMIT 1
      )
    """

    // Execute the SQL query
    writeDB(sqlDeleteQuery, List(
      SqlParameter("String", customerName),
      SqlParameter("String", dishName),
      SqlParameter("String", orderCount)
    )).map(_ => "Complete OK.")
  }
}