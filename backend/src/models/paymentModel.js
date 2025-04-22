const db = require('../config/db')

const savePayment = async(conn,booking_id,user_id,amount,transaction_uuid) => {

     await conn.execute(`INSERT INTO payments (booking_id,user_id,amount,transaction_id) VALUES (?,?,?,?)`,[booking_id,user_id,amount,transaction_uuid])


}

const getBookingId = async(transaction_uuid) => {

   const [payment]=  await db.execute(`SELECT booking_id FROM payments WHERE transaction_id = ? `,[transaction_uuid])
   return payment[0].booking_id

}

const updatePaymentStatus = async(status,transaction_uuid) => {

    await db.execute(`UPDATE payments SET status = ?  WHERE transaction_id = ? `,[status,transaction_uuid])
   
}


module.exports = {savePayment,getBookingId,updatePaymentStatus}