package Impl

enum FinishState:
  case Done, Processing, Rejected

object FinishState:
  def fromString(state: String): FinishState = state match
    case "done"      => Done
    case "processing"  => Processing
    case "rejected"      => Rejected
    case _             => throw new IllegalArgumentException(s"Unknown finish state: $state")
