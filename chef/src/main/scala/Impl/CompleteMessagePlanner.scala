package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import cats.effect.IO
import io.circe.generic.auto.*

case class CompleteMessagePlanner(orderDesp: OrderDesp, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
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
      SqlParameter("String", if (orderDesp.state == "1") "done" else "rejected"),
      SqlParameter("String", orderDesp.customerName),
      SqlParameter("String", orderDesp.dishName),
      SqlParameter("String", orderDesp.orderCount),
      SqlParameter("String", orderDesp.orderID),
      SqlParameter("String", orderDesp.orderPart)
    )).map(_ => "Complete dish successfully.")
  }
}