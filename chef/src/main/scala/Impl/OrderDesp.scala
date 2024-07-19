package Impl

case class OrderDesp(
                      customerName: String,
                      chefName: String,
                      dishName: String,
                      orderCount: String,
                      state: FinishState,
                      orderID: String,
                      orderPart: String
                    )
