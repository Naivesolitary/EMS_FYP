const db = require('../config/db')


   // You must pass a MySQL dbection object to use transactions
const createBooking = async (conn, userId, eventId,fullName,phoneNumber) => {
  const [result] = await conn.execute(
    `INSERT INTO bookings (user_id, event_id, total_amount,name_at_booking,phone_at_booking) VALUES (?, ?, ?,?,?)`,
    [userId, eventId, 0.00,fullName,phoneNumber]
  );
  return result.insertId;
};

const insertBookingItem = async (conn, bookingId, ticketId, quantity, price) => {
 const newBookingItem = await conn.execute(
    `INSERT INTO booking_items (booking_id, ticket_id, quantity, price) VALUES (?, ?, ?, ?)`,
    [bookingId, ticketId, quantity, price]
  );

  return newBookingItem[0].insertId
};

const updateBookingTotal = async ( conn,bookingId, totalAmount) => {
  await conn.execute(
    `UPDATE bookings SET total_amount = ? WHERE booking_id = ?`,
    [totalAmount, bookingId]
  );
};

const reduceTicketQuantity = async(conn, ticket_id, quantity) =>{
    const updatedTickedInfo = await conn.execute(`UPDATE tickets SET remaining_quantity = remaining_quantity - ? WHERE ticket_id = ? `,[quantity,ticket_id])
    return updatedTickedInfo[0]
  
  };


  const updateBookingStatus = async(status,booking_id) => {
    await db.execute(`UPDATE bookings SET status = ? WHERE booking_id = ?`,[status,booking_id])

  }

  const addPaymentId = async(booking_id,payment_id) => {
    await db.execute(`UPDATE bookings SET payment_id = ? WHERE booking_id = ?`,[payment_id,booking_id])

  }

  const getPaymentId = async(booking_id) => {
    const [result] = await db.execute(`SELECT payment_id FROM payments WHERE booking_id = ?`,[booking_id])
    return result[0].payment_id

  }


  const checkBooking = async(user_id,event_id) => {
    const [rows] = await db.execute(`SELECT COUNT(*) AS bookings
      FROM bookings 
    WHERE user_id = ? AND event_id = ? AND status != 'cancelled';`,[user_id,event_id])
    console.log(rows[0])
    // return rows[0]
    if (rows[0].bookings > 0) {
      return ({ alreadyBooked: true });
    } else {
      return ({ alreadyBooked: false });
    }
  }

module.exports = {
  createBooking,
  insertBookingItem,
  updateBookingTotal,
  reduceTicketQuantity,
  updateBookingStatus,
  getPaymentId,
  addPaymentId,
  checkBooking,
};

