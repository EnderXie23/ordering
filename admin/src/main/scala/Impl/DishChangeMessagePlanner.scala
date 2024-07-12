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

case class DishChangeMessagePlanner(name: String, imgPath: String, price: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    val sqlQuery = writeDB(
      s"INSERT INTO ${schemaName}.dishes (name, img_path, price) VALUES (?, ?, ?)",
        List(
        SqlParameter("String", name),
        SqlParameter("String", imgPath),
        SqlParameter("String", price)
      )
    )

    sqlQuery.flatMap { _ =>
      IO.pure("Dish added successfully")
    }
  }
}
