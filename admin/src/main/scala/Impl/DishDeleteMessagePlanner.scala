package Impl

import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import APIs.CustomerAPI.CustomerQueryMessage
import cats.effect.IO
import io.circe.generic.auto.*

case class DishDeleteMessagePlanner(name: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    val sqlQuery = writeDB(
      s"DELETE FROM ${schemaName}.dishes WHERE name = ?",
      List(
        SqlParameter("String", name)
      )
    )

    sqlQuery.flatMap { _ =>
      IO.pure("Dish deleted successfully")
    }
  }
}
