package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

case class RejectMessagePlanner(rejectDesp: RejectDesp, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    // Define the SQL query to fetch orders
    val sqlUpdateQuery = s"""
      INSERT INTO ${schemaName}.reject_log (customer_name, chef_name, dish_name, order_count, orderid, orderpart, reason) VALUES (?, ?, ?, ?, ?, ?, ?)
    """

    // Execute the SQL query
    writeDB(sqlUpdateQuery, List(
      SqlParameter("String", rejectDesp.customerName),
      SqlParameter("String", rejectDesp.chefName),
      SqlParameter("String", rejectDesp.dishName),
      SqlParameter("String", rejectDesp.orderCount),
      SqlParameter("String", rejectDesp.orderID),
      SqlParameter("String", rejectDesp.orderPart),
      SqlParameter("String", rejectDesp.reason)
    )).flatMap { _ =>
      IO.pure("Reject dish successfully.")
    }
  }
}