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
      case "ReadCommentsMessage" =>
        IO(decode[ReadCommentsMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for ReadCommentsMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "CustomerQueryStateMessage" =>
        IO(decode[CustomerQueryStateMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for CustomerQueryStateMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "CustomerEditProfileMessage" =>
        IO(decode[CustomerEditProfileMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for CustomerEditProfileMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "CustomerChargeMessage" =>
        IO(decode[CustomerChargeMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for CustomerChargeMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "CustomerCommentMessage" =>
        IO(decode[CustomerCommentMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for CustomerCommentMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "CustomerLoginMessage" =>
        IO(decode[CustomerLoginMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for CustomerLoginMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "CustomerQueryProfileMessage" =>
        IO(decode[CustomerQueryProfileMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for CustomerQueryMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "CustomerChangePwdMessage" =>
        IO(decode[CustomerChangePwdMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for CustomerQueryMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "CustomerOrderMessage" =>
        println(str)
        IO(decode[CustomerOrderMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for CustomerOrderMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "CustomerRegisterMessage" =>
        IO(decode[CustomerRegisterMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for CustomerRegisterMessage")))
          .flatMap{m=>
            m.fullPlan.map(_.asJson.toString)
          }
      case "CustomerHistoryMessage" =>
        IO(decode[CustomerHistoryMessagePlanner](str).getOrElse(throw new Exception("Invalid JSON for CustomerHistoryMessage")))
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
