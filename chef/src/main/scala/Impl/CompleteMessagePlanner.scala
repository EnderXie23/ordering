package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Impl.FinishState.ToString
import cats.effect.IO
import io.circe.generic.auto.*

case class CompleteMessagePlanner(orderDesp: OrderDesp, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    startTransaction {
      for {
        _ <- {
          // Update customer.customer_rec
          val query =s"""
                UPDATE customer.order_rec
                SET finish_state = ?
                WHERE customer_name = ?
                AND dish_name = ?
                AND order_count = ?
                AND orderid = ?
                AND orderpart = ?
              """
            val params = List(
              SqlParameter("String", ToString(orderDesp.state)),
              SqlParameter("String", orderDesp.customerName),
              SqlParameter("String", orderDesp.dishName),
              SqlParameter("String", orderDesp.orderCount),
              SqlParameter("String", orderDesp.orderID),
              SqlParameter("String", orderDesp.orderPart)
            )
          writeDB(query, params).handleErrorWith { error =>
            IO.raiseError(new Exception(s"Failed to log dish record: ${error.getMessage}"))
          }
        }
        _ <- {
          // Update admin.admin_log
          val query2 =
            """UPDATE admin.admin_log
                    SET chef_name = ?,
                    state = ?
                    WHERE user_name = ?
                    AND orderid = ?
                    AND orderpart = ?
                    AND dish_name = ?
              """
          val params2 = List(
            SqlParameter("String", orderDesp.chefName),
            SqlParameter("String", ToString(orderDesp.state)),
            SqlParameter("String", orderDesp.customerName),
            SqlParameter("String", orderDesp.orderID),
            SqlParameter("String", orderDesp.orderPart),
            SqlParameter("String", orderDesp.dishName)
          )
          writeDB(query2, params2).handleErrorWith { error =>
            IO.raiseError(new Exception(s"Failed to log dish record: ${error.getMessage}"))
          }
        }
      } yield "RecordMessage successful" // <-- Indicate success message
    }
  }
}