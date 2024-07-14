package Process

import Common.API.{API, PlanContext, TraceID}
import Global.{ServerConfig, ServiceCenter}
import Common.DBAPI.{initSchema, writeDB, readDBRows}
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*
import org.http4s.client.Client
import Common.Object.{ParameterList, SqlParameter}
import io.circe.Json

import java.util.UUID

object Init {
  def init(config: ServerConfig): IO[Unit] =
    val checkQuery = s"SELECT COUNT(*) FROM ${schemaName}.admin_log WHERE user_name = ? AND chef_name = ? AND dish_name = ? AND quantity = ? AND state = ?"
    val insertQuery = s"INSERT INTO ${schemaName}.admin_log (orderID, orderPart, user_name, chef_name, dish_name, price, quantity, takeaway, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    val checkParams = List(
      SqlParameter("String", "0"),
      SqlParameter("String", "0"),
      SqlParameter("String", "0"),
      SqlParameter("String", "0"),
      SqlParameter("String", "2")
    )
    val insertParams = List(
      SqlParameter("String", "0"), // orderID can be set to a default or generated value
      SqlParameter("String", "0"),
      SqlParameter("String", "0"),
      SqlParameter("String", "0"),
      SqlParameter("String", "0"),
      SqlParameter("String", "0"),
      SqlParameter("String", "0"),
      SqlParameter("String", "0"),
      SqlParameter("String", "2")
    )

    given PlanContext = PlanContext(traceID = TraceID(UUID.randomUUID().toString), 0)

    for {
      _ <- API.init(config.maximumClientConnection)
      _ <- initSchema(schemaName)
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.dishes (name TEXT, img_path TEXT, price TEXT)", List())
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.admin_log (orderID TEXT, orderPart TEXT, user_name TEXT, chef_name TEXT, dish_name TEXT, quantity TEXT, price TEXT, takeaway TEXT, state TEXT)", List())
      _ <- writeDB(s"DELETE FROM ${schemaName}.admin_log", List.empty)
      rows <- readDBRows(checkQuery, checkParams)
      count = (rows.headOption.flatMap(_.hcursor.get[Int]("count").toOption)).getOrElse(0)
      result <- if (count == 0) {
        writeDB(insertQuery, insertParams).handleErrorWith { error =>
          IO.raiseError(new Exception(s"Failed to log dish record: ${error.getMessage}"))
        }.map(_ => Json.obj("status" -> Json.fromString("Inserted new row")))
      } else {
        IO.pure(Json.obj("status" -> Json.fromString("Row already exists")))
      }
    } yield ()
}
