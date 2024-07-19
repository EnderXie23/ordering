package APIs.AdminAPI

import Impl.LogInfo

case class OrderLogMessage(logInfo: LogInfo) extends AdminMessage[String]