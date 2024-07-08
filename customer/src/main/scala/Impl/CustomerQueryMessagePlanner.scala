package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName


case class CustomerQueryMessagePlanner(customerName:String, orders: List[(String, String)], override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    IO.pure("Nothing happened.")
  }
