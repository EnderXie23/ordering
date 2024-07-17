package Impl

import Impl.FinishState

case class UserHistory(orderID: String,
                       orderPart: String,
                       dishName: String,
                       quantity: Int,
                       price: Int,
                       finishState: FinishState)

