package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class CustomerRegisterMessagePlanner(userName: String, password: String, nickname: String, phone: String,
                                          override val planContext: PlanContext) extends Planner[String]:
  override def plan(using planContext: PlanContext): IO[String] = {
    // Check if the user is already registered
    val checkUserExists = readDBBoolean(s"SELECT EXISTS(SELECT 1 FROM ${schemaName}.user_name WHERE user_name = ?)",
        List(SqlParameter("String", userName))
      )

    checkUserExists.flatMap { exists =>
      if (exists) {
        IO.raiseError(new Exception("already registered"))
      } else {
        writeDB(s"INSERT INTO ${schemaName}.user_name (user_name, password, nickname, phone) VALUES (?, ?, ?, ?)",
          List(SqlParameter("String", userName),
               SqlParameter("String", password),
               SqlParameter("String", nickname),
               SqlParameter("String", phone),
          ))
      }
    }
  }

