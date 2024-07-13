package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.KeyDecoder.decodeKeyString
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows, readDBString, startTransaction, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class CustomerCommentMessagePlanner(customerName:String, chefName: String, comment: String, overall: String, taste: String, pack: String, serv: String, env: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    writeDB(s"INSERT INTO ${schemaName}.ratings (customer_name, chef_name, comment, overall, taste, pack, serv, env) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      List(SqlParameter("String", customerName),
        SqlParameter("String", chefName),
        SqlParameter("String", comment),
        SqlParameter("String", overall),
        SqlParameter("String", taste),
        SqlParameter("String", pack),
        SqlParameter("String", serv),
        SqlParameter("String", env)
      ))

    IO.pure("Comment added successfully")
  }

