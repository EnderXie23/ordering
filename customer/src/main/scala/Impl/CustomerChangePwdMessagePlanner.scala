package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class CustomerChangePwdMessagePlanner(userName: String, old_password: String, new_password: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    val checkUserPwdExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.user_name WHERE user_name = ? AND password = ?)",
      List(SqlParameter("String", userName),
        SqlParameter("String", old_password))
    )

    checkUserPwdExists.flatMap { exists =>
      if (exists) {
        val updatePwd = writeDB(
          s"UPDATE ${schemaName}.user_name SET password = ? WHERE user_name = ?",
          List(SqlParameter("String", new_password), SqlParameter("String", userName))
        )

        updatePwd.flatMap { _ =>
          IO.pure("Password changed successfully")
        }
      } else {
        IO.pure("password is wrong")
      }
    }
  }
