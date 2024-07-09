package Process

import Common.API.{API, PlanContext, TraceID}
import Global.{ServerConfig, ServiceCenter}
import Common.DBAPI.{initSchema, writeDB}
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*
import org.http4s.client.Client
import Common.Object.{ParameterList, SqlParameter}

import java.util.UUID

object Init {
  def init(config:ServerConfig):IO[Unit]=
    given PlanContext=PlanContext(traceID = TraceID(UUID.randomUUID().toString),0)
    for{
      _ <- API.init(config.maximumClientConnection)
      _ <- initSchema(schemaName)
      //_ <- writeDB(s"DROP TABLE IF EXISTS ${schemaName}.user_name", List())
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.admin_log (orderID TEXT, user_name TEXT, chef_name TEXT,dish_name TEXT, quantity TEXT, state TEXT)", List())
      _ <- {
        val query = s"INSERT INTO ${schemaName}.admin_log (orderID, user_name, chef_name, dish_name, quantity, state) VALUES (?, ?, ?, ?, ?)"
        val params = List(
          SqlParameter("String", "0"),
          SqlParameter("String", "0"),
          SqlParameter("String", "0"),
          SqlParameter("String", "0"),
          SqlParameter("String", "0"),
          SqlParameter("String", "2")
        )
        writeDB(query, params).handleErrorWith { error =>
          IO.raiseError(new Exception(s"Failed to log dish record: ${error.getMessage}"))
        }
      }
    } yield ()
}
