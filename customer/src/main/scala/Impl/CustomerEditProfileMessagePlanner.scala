package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class CustomerEditProfileMessagePlanner(userName: String, nickname: String, phone: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    val updateProfile = writeDB(
      s"UPDATE ${schemaName}.user_name SET nickname = ?, phone = ? WHERE user_name = ?",
      List(
        SqlParameter("String", nickname),
        SqlParameter("String", phone),
        SqlParameter("String", userName)
      )
    )

    updateProfile.flatMap { _ =>
      IO.pure("Profile updated successfully")
    }
  }
