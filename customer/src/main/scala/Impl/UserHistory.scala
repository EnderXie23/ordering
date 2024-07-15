package Impl

case class UserHistory(orderID: String,
                       orderPart: String,
                       dishName: String,
                       quantity: Int,
                       price: Int,
                       state: String)