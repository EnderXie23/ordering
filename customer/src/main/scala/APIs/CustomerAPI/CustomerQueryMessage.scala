package APIs.CustomerAPI

case class CustomerQueryMessage(doctorName:String, patientName:String) extends CustomerMessage[String]
