package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import io.circe.Json

case class ReadCommentsMessagePlanner(override val planContext: PlanContext) extends Planner[List[Comment]]:
  override def plan(using PlanContext): IO[List[Comment]] = {
    val jsonResultsIO: IO[List[Json]] = readDBRows(
      s"SELECT customer_name, comment, overall, taste, pack, serv, env  FROM ${schemaName}.ratings",
      List.empty)

    // Convert the JSON results to a list of tuples
    jsonResultsIO.map { jsonResults =>
      jsonResults.map { jsonResult =>
        Comment(
          jsonResult.hcursor.downField("customerName").as[String].toOption.getOrElse(""),
          "",
          jsonResult.hcursor.downField("comment").as[String].toOption.getOrElse(""),
          jsonResult.hcursor.downField("overall").as[String].toOption.getOrElse(""),
          jsonResult.hcursor.downField("taste").as[String].toOption.getOrElse(""),
          jsonResult.hcursor.downField("pack").as[String].toOption.getOrElse(""),
          jsonResult.hcursor.downField("serv").as[String].toOption.getOrElse(""),
          jsonResult.hcursor.downField("env").as[String].toOption.getOrElse("")
        )
      }
    }
  }
