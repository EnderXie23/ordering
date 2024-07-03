package Impl

import Common.API.{PlanContext, Planner}
import Common.DBAPI.{startTransaction, writeDB}
import cats.effect.IO
import io.circe.generic.auto.*
import Common.API.{PlanContext, Planner}
import Common.DBAPI.*
import Common.Object.{ParameterList, SqlParameter}
import Common.ServiceUtils.schemaName
import APIs.CustomerAPI.CustomerQueryMessage
import cats.effect.IO
import cats.syntax.all.toTraverseOps
import io.circe.Json
import io.circe.generic.auto.*

case class ChefReadOrdersPlanner(chefName: String, override val planContext: PlanContext) extends Planner[List[(String, String, Int)]] {
  override def plan(using PlanContext): IO[List[(String, String, Int)]] = {
    // Define the SQL query to fetch orders
    val sqlQuery = s"SELECT customer_name, dish_name, order_count FROM ${schemaName}.order_rec"

    // Execute the query and get the results as JSON
    val jsonResultsIO: IO[List[Json]] = readDBRows(sqlQuery, List.empty)

    // Convert the JSON results to a list of tuples
    jsonResultsIO.flatMap { jsonResults =>
      IO.fromEither {
        jsonResults.traverse { json =>
          for {
            customerName <- json.hcursor.get[String]("customer_name")
            dishName <- json.hcursor.get[String]("dish_name")
            orderCount <- json.hcursor.get[Int]("order_count")
          } yield (customerName, dishName, orderCount)
        }
      }
    }
  }
}

case class AddCustomerMessagePlanner(chefName: String, customerName: String, override val planContext: PlanContext) extends Planner[String]:
  override def plan(using PlanContext): IO[String] = {
    startTransaction{
      for {
        _ <- writeDB(s"INSERT INTO ${schemaName}.chef_customer (chef_name, customer_name) VALUES (?, ?)",
          List(SqlParameter("String", chefName), SqlParameter("String", ""))
        )
        a <- startTransaction {
          CustomerQueryMessage(chefName, customerName).send
        }
      } yield "OK"
    }
  }

