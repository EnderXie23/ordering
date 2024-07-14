package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.KeyDecoder.decodeKeyString
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows, readDBString}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class CustomerQueryStateMessagePlanner(orderID: String, dishName: String, override val planContext: PlanContext) extends Planner[Option[String]] {
  override def plan(using PlanContext): IO[Option[String]] = {
    readDBRows(
      s"SELECT finish_state FROM ${schemaName}.order_rec WHERE orderID = ? AND dish_name = ?",
      List(SqlParameter("String", orderID), SqlParameter("String", dishName))
    ).map {
      case head :: _ => // If there is at least one result
        val state = head.hcursor.get[String]("finishState").getOrElse("N/A")
        Some(state)
      case Nil => // If no results
        None
    }
  }
}

