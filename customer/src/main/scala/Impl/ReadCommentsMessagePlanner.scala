package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import io.circe.Json

case class ReadCommentsMessagePlanner(override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    val jsonResultsIO: IO[List[Json]] = readDBRows(
      s"SELECT customer_name, comment, overall, taste, pack, serv, env  FROM ${schemaName}.ratings",
      List.empty)

    // Convert the JSON results to a list of tuples
    val results: IO[List[(String, String, String, String, String, String, String)]] = jsonResultsIO.map { jsonResults =>
      jsonResults.map { jsonResult =>
        val customerName = jsonResult.hcursor.downField("customerName").as[String].getOrElse("Unknown Customer")
        val comment = jsonResult.hcursor.downField("comment").as[String].getOrElse("Unknown Comment")
        val overall = jsonResult.hcursor.downField("overall").as[String].getOrElse("Unknown Overall")
        val taste = jsonResult.hcursor.downField("taste").as[String].getOrElse("Unknown Taste")
        val pack = jsonResult.hcursor.downField("pack").as[String].getOrElse("Unknown Pack")
        val serv = jsonResult.hcursor.downField("serv").as[String].getOrElse("Unknown Serv")
        val env = jsonResult.hcursor.downField("env").as[String].getOrElse("Unknown Env")
        (customerName, comment, overall, taste, pack, serv, env)
      }
    }

    // Convert the list of tuples to a formatted string
    results.map { resultsList =>
      resultsList
        .map { case (customerName, comment, overall, taste, pack, serv, env) =>
          s"$customerName\\$comment\\$overall\\$taste\\$pack\\$serv\\$env"
        }
        .mkString("\n")
    }
  }
