package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

import scala.language.postfixOps

case class CustomerOrderMessagePlanner(userName: String, orderID: String, orderPart: String, orders: List[OrderInfo], override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    // Insert into database the customer order
    val insertStatements = orders.map { order =>
      writeDB(s"INSERT INTO ${schemaName}.order_rec (customer_name, orderID, orderPart, dish_name, order_count, price, finish_state, takeout) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        List(
          SqlParameter("String", userName),
          SqlParameter("String", orderID),
          SqlParameter("String", orderPart),
          SqlParameter("String", order.dishName),
          SqlParameter("String", order.orderCount),
          SqlParameter("String", order.price),
          SqlParameter("String", "processing"),
          SqlParameter("String", order.takeout)
        ))
    };

    // Combine all the insert statements into one transaction
    startTransaction(insertStatements.reduce(_ >> _)) >>
      IO.pure("Order placed successfully");
  }
