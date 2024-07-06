package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.KeyDecoder.decodeKeyString
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows, readDBString}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class CustomerLoginMessagePlanner(userName: String, password: String, override val planContext: PlanContext) extends Planner[(String, Option[String])] {
  override def plan(using PlanContext): IO[(String, Option[String])] = {
    // Attempt to validate the user by reading the rows from the database
    readDBRows(
      s"SELECT user_name, nickname FROM ${schemaName}.user_name WHERE user_name = ? AND password = ?",
      List(SqlParameter("String", userName), SqlParameter("String", password))
    ).map {
      case Nil => ("Invalid user", None)
      case head :: _ =>
        // extract the nickname from the database
        val nickname = head.hcursor.get[String]("nickname")
        nickname match {
          case Left(failure) => ("Valid user", None)
          case Right(name) => ("Valid user", Some(name))
        }
    }
  }
}

