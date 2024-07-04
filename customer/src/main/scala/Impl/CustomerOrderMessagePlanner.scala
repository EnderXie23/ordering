package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*

import scala.language.postfixOps


case class CustomerOrderMessagePlanner(userName: String, orders: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    // Insert into database the customer order
    val ordersList = orders.split(";").toList.map { order =>
      val parts = order.split(",")
      (parts(0), parts(1))
    };

    val insertStatements = ordersList.map { case (dishName, orderCount) =>
      writeDB(s"INSERT INTO ${schemaName}.order_rec (customer_name, dish_name, order_count) VALUES (?, ?, ?)",
        List(
          SqlParameter("String", userName),
          SqlParameter("String", dishName),
          SqlParameter("String", orderCount)
        ))
    };

    // Combine all the insert statements into one transaction
    startTransaction(insertStatements.reduce(_ >> _)) >>
    IO.pure(userName);
  }