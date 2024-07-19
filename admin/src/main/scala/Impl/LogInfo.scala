package Impl

import Impl.FinishState

case class LogInfo(
                    orderid: String,
                    orderPart: String,
                    userName: String,
                    chefName: String,
                    dishName: String,
                    quantity: String,
                    price: String,
                    takeaway: String,
                    state: FinishState,
                    rating: String
                  )
