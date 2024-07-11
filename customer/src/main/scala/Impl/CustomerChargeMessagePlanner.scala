package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class CustomerChargeMessagePlanner(userName: String, amount: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    val updateSavings = writeDB(
      s"UPDATE ${schemaName}.user_name SET savings = ? WHERE user_name = ?",
      List(SqlParameter("String", amount), SqlParameter("String", userName))
    )

    updateSavings.flatMap { _ =>
      IO.pure("Savings updated successfully")
    }
  }
