package APIs.CustomerAPI

import Common.API.API
import Global.ServiceCenter.customerServiceCode
import io.circe.Decoder

abstract class CustomerMessage[ReturnType:Decoder] extends API[ReturnType](customerServiceCode)
