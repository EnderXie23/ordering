package APIs.AdminAPI

import Common.API.API
import Global.ServiceCenter.adminServiceCode
import io.circe.Decoder

abstract class AdminMessage[ReturnType:Decoder] extends API[ReturnType](adminServiceCode)
