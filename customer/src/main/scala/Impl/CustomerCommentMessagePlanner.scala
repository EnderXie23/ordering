package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import io.circe.KeyDecoder.decodeKeyString
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{readDBRows, readDBString, startTransaction, writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName

case class CustomerCommentMessagePlanner(comment: Comment, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    writeDB(s"INSERT INTO ${schemaName}.ratings (customer_name, chef_name, comment, overall, taste, pack, serv, env) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      List(
        SqlParameter("String", comment.customerName),
        SqlParameter("String", comment.chefName),
        SqlParameter("String", comment.comment),
        SqlParameter("String", comment.overall),
        SqlParameter("String", comment.taste),
        SqlParameter("String", comment.pack),
        SqlParameter("String", comment.serv),
        SqlParameter("String", comment.env)
      )).flatMap { _ =>
      IO.pure("Comment added successfully")
    }
  }

