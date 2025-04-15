const db = require('../config/db')


   // You must pass a MySQL dbection object to use transactions
const createBooking = async (conn, userId, eventId) => {
  const [result] = await conn.execute(
    `INSERT INTO bookings (user_id, event_id, total_amount) VALUES (?, ?, ?)`,
    [userId, eventId, 0.00]
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

module.exports = {
  createBooking,
  insertBookingItem,
  updateBookingTotal,
  reduceTicketQuantity
};

