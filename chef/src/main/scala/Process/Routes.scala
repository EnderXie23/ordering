package Process

import Common.API.PlanContext
import Impl.*
import cats.effect.*
import io.circe.generic.auto.*
import io.circe.parser.decode
import io.circe.syntax.*
import org.http4s.*
import org.http4s.client.Client
import org.http4s.dsl.io.*


object Routes:
  private def executePlan(messageType:String, str: String): IO[String]=
    messageType match {
      case "AdminQueryMessage" =>
        IO(decode[AdminQueryMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AdminQueryMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "CompleteMessage" =>
        IO(decode[CompleteMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for CompleteMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "QueryMessage" =>
        IO(decode[QueryMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for ChefReadOrders")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "AddCustomerMessage" =>
        IO(decode[AddCustomerMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for AddCustomerMessage")))
           .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "LoginMessage" =>
        IO(decode[LoginMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for LoginMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "RegisterMessage" =>
        IO(decode[RegisterMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for RegisterMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "LogMessage" =>
        IO(decode[LogMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for LogMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case _ =>
        IO.raiseError(new Exception(s"Unknown type: $messageType"))
    }

  val service: HttpRoutes[IO] = HttpRoutes.of[IO]:
    case req @ POST -> Root / "api" / name =>
        println("request received")
        req.as[String].flatMap{executePlan(name, _)}.flatMap(Ok(_))
        .handleErrorWith{e =>
          println(e)
          BadRequest(e.getMessage)
        }
