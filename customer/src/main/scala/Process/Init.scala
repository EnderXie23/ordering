package Process

import Common.API.{API, PlanContext, TraceID}
import Global.{ServerConfig, ServiceCenter}
import Common.DBAPI.{initSchema, writeDB}
import Common.ServiceUtils.schemaName
import cats.effect.IO
import io.circe.generic.auto.*
import org.http4s.client.Client

import java.util.UUID

object Init {
  def init(config:ServerConfig):IO[Unit]=
    given PlanContext=PlanContext(traceID = TraceID(UUID.randomUUID().toString),0)
    for{
      _ <- API.init(config.maximumClientConnection)
      _ <- initSchema(schemaName)
//      _ <- writeDB(s"DROP TABLE IF EXISTS ${schemaName}.user_name", List())
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.user_name (user_name TEXT, password TEXT, nickname TEXT, phone TEXT, savings TEXT)", List())
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.order_rec (customer_name TEXT, orderID TEXT, orderPart TEXT, price TEXT, dish_name TEXT, order_count TEXT, finish_state TEXT, takeout TEXT)", List())
      _ <- writeDB(s"CREATE TABLE IF NOT EXISTS ${schemaName}.ratings (customer_name TEXT, chef_name TEXT,comment TEXT, overall TEXT, taste TEXT, pack TEXT, serv TEXT, env TEXT)", List())
//      _ <- writeDB(s"DELETE FROM ${schemaName}.order_rec", List.empty)
    } yield ()

}
