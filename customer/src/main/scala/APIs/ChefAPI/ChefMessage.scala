package APIs.ChefAPI

import Common.API.API
import Global.ServiceCenter.chefServiceCode
import io.circe.Decoder

abstract class ChefMessage[ReturnType:Decoder] extends API[ReturnType](chefServiceCode)
