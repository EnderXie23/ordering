package Impl

import cats.effect.IO
import io.circe.Json
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import APIs.CustomerAPI.CustomerQueryMessage
import cats.effect.IO
import io.circe.generic.auto.*

case class DishQueryMessagePlanner(override val planContext: PlanContext) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    val sqlQuery = s"SELECT name, img_path, price FROM ${schemaName}.dishes"
    val jsonResultsIO: IO[List[Json]] = readDBRows(sqlQuery, List.empty)

    val results: IO[List[(String, String, String)]] = jsonResultsIO.map { jsonResults =>
      jsonResults.map { jsonResult =>
        val name = jsonResult.hcursor.downField("name").as[String].getOrElse("Unknown Dish")
        val imgPath = jsonResult.hcursor.downField("imgPath").as[String].getOrElse("No img")
        val price = jsonResult.hcursor.downField("price").as[String].getOrElse("N/A")
        (name, imgPath, price)
      }
    }

    results.map { resultsList =>
      resultsList.map { case (name, imgPath, price) =>
        s"$name,$imgPath,$price"
      }.mkString("\n")
    }
  }
}
