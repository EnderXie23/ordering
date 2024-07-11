package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class CustomerQueryProfileMessagePlanner(userName: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    val queryUserProfile = readDBRows(
      s"SELECT nickname, phone, savings FROM ${schemaName}.user_name WHERE user_name = ?",
      List(SqlParameter("String", userName))
    )

    queryUserProfile.flatMap {
      case head :: _ => // If there is at least one result
        val nickname = head.hcursor.get[String]("nickname").getOrElse("N/A")
        val phoneNumber = head.hcursor.get[String]("phone").getOrElse("N/A")
        val savings = head.hcursor.get[Double]("savings").getOrElse("0")
        IO.pure(s"$nickname\n$phoneNumber\n$savings")
      case Nil => // If no results
        IO.raiseError(new Exception("User not found"))
    }
  }
