package Impl

import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import io.circe.Json
case class CustomerChargeMessagePlanner(userName: String, amount: String, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using PlanContext): IO[String] = {
    val sqlQuery = s"SELECT savings FROM ${schemaName}.user_name WHERE user_name = ?"
    val parameters = List(SqlParameter("String", userName))
    val jsonResultsIO: IO[List[Json]] = readDBRows(sqlQuery, parameters)

    val resultsIO: IO[Double] = jsonResultsIO.flatMap { jsonList =>
      val savingsList = jsonList.flatMap { json =>
        json.hcursor.downField("savings").as[Double].toOption
      }
      IO.pure(savingsList.headOption.getOrElse(0.0))
    }

    resultsIO.flatMap { currentSavings =>
      val newSavings = currentSavings - amount.toDouble
      val updateSavings = writeDB(
        s"UPDATE ${schemaName}.user_name SET savings = ? WHERE user_name = ?",
        List(SqlParameter("String", newSavings.toString), SqlParameter("String", userName))
      )

      updateSavings.flatMap { _ =>
        IO.pure("Savings updated successfully")
      }
    }
  }
}