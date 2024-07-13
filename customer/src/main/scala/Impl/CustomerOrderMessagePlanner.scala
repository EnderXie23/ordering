package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

import scala.language.postfixOps


case class CustomerOrderMessagePlanner(userName: String,orderID:String,orderPart:String, orders: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    // Insert into database the customer order
    val ordersList = orders.split(";").toList.map { order =>
      val parts = order.split(",")
      (parts(0), parts(1), parts(2), parts(3))
    };

    val insertStatements = ordersList.map { case (dishName, orderCount, price, takeout) =>
      writeDB(s"INSERT INTO ${schemaName}.order_rec (customer_name, orderID, orderPart, dish_name, order_count, price, finish_state, takeout) VALUES (?, ?,?,?,?, ?, ?, ?)",
        List(
          SqlParameter("String", userName),
          SqlParameter("String", orderID),
          SqlParameter("String", orderPart),
          SqlParameter("String", dishName),
          SqlParameter("String", orderCount),
          SqlParameter("String", price),
          SqlParameter("String", "processing"),
          SqlParameter("String", takeout)
        ))
    };

    // Combine all the insert statements into one transaction
    startTransaction(insertStatements.reduce(_ >> _)) >>
    IO.pure("Order placed successfully");
  }
