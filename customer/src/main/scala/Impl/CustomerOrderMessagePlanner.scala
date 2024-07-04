package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*


case class CustomerOrderMessagePlanner(customerName:String, orders: List[(String, String)], override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    // Insert into database the customer order
    val insertStatements = orders.map{ case (dishName, orderCount)=>
      writeDB(s"INSERT INTO ${schemaName}.order_rec (customer_name, dish_name, order_count) VALUES (?, ?, ?)",
        List(
          SqlParameter("String", customerName),
          SqlParameter("String", dishName),
          SqlParameter("String", orderCount)
          // The encoder asks for String type
        ))
    }

    // Combine all the insert statements into one transaction
    startTransaction(insertStatements.reduce(_ >> _)) >>
    IO.pure(customerName)
  }
