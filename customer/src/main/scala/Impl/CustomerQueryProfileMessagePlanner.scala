package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class CustomerQueryProfileMessagePlanner(userName: String, override val planContext: PlanContext) extends Planner[Profile]:
  override def plan(using PlanContext): IO[Profile] = {
    val queryUserProfile = readDBRows(
      s"SELECT nickname, phone, savings FROM ${schemaName}.user_name WHERE user_name = ?",
      List(SqlParameter("String", userName))
    )

    queryUserProfile.map { jsonResult =>{
        Profile(
          jsonResult.head.hcursor.downField("nickname").as[String].getOrElse("N/A"),
          jsonResult.head.hcursor.downField("phone").as[String].getOrElse("N/A"),
          jsonResult.head.hcursor.downField("savings").as[Double].getOrElse(0.0)
        )
      }
    }
  }
