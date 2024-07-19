package Impl

import io.circe.*
import io.circe.generic.semiauto._
import io.circe.syntax.*

enum FinishState:
  case Done, Processing, Rejected, SpecialMark

object FinishState:
  def fromString(state: String): FinishState = state match
    case "1" => Done
    case "3" => Processing
    case "2" => SpecialMark
    case _   => Rejected

  def fromDBString(state: String): FinishState = state match
    case "done" => Done
    case "processing" => Processing
    case "rejected" => Rejected
    case _ => SpecialMark

  def ToString(state: FinishState): String = state match
    case Done => "done"
    case Processing => "processing"
    case SpecialMark => "special_mark"
    case Rejected => "rejected"
  
  implicit val decodeFinishState: Decoder[FinishState] = Decoder.decodeString.emap {
    case "done" => Right(Done)
    case "processing" => Right(Processing)
    case "2" => Right(SpecialMark)
    case "rejected" => Right(Rejected)
    case _ => Left("Unknown finish state")
}