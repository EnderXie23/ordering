package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class DishRatingMessagePlanner(orderID: String, dishName: String, rating: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    val updateProfile = writeDB(
      s"UPDATE admin.admin_log SET rating = ? WHERE orderid = ? AND dish_name = ?",
      List(
        SqlParameter("String", rating),
        SqlParameter("String", orderID),
        SqlParameter("String", dishName)
      )
    )

    updateProfile.flatMap { _ =>
      IO.pure("Dish rating updated successfully")
    }
  }
