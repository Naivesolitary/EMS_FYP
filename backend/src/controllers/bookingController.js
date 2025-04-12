const {updateBookingTotal,createBooking,reduceTicketQuantity,insertBookingItem} = require('../models/bookingModel');
const {getTicketById} = require('../models/ticketModel');
const ApiError = require('../utils/ApiError');
const asyncErrorHandler = require('../utils/asyncErrorHandler')
const db = require('../config/db');
const { response } = require('express');
const sendResponse = require('../utils/sendResponse');
  
  

  // TESTED Successfully
  const bookEventTicket = async (req, res) => {
    let conn;
    try{
    const user_id = 2;
    const event_id = req.params.eventId;
    const {selected_tickets} = req.body;
   

     conn = await db.getConnection();

    await conn.beginTransaction();

    const bookingId = await createBooking(conn,user_id,event_id);
     console.log(`1st query: ${conn}`,bookingId)
    let total_amount = 0;
    for(const item of selected_tickets){
       const {ticket_id, quantity} = item
       const ticket = await getTicketById(conn,ticket_id);
       console.log(`2nd Query: ${conn}`,ticket)
       if (!ticket) {
        throw new ApiError(404,`Ticket ID ${ticket_id} not found`);
      }

      if(ticket.remaining_quantity < quantity ){
         throw new ApiError(401,`Not enough tickets for Ticket ID ${ticket_id}. Requested: ${quantity}, Available: ${ticket.remaining_quantity}`)

      }
      const cost = ticket.price * quantity
      total_amount += cost
      const isBookingItemInserted = await insertBookingItem(conn, bookingId, ticket_id, quantity, ticket.price);
      console.log('new Book item Inserted',isBookingItemInserted)
      const isQntyReduced = await reduceTicketQuantity(conn, ticket_id, quantity);
      console.log('Quantity Reduced: ',isQntyReduced)
      await updateBookingTotal(conn, bookingId, total_amount);
  
    }
    sendResponse(res,{message: 'Booking successful', data:{bookingId,total_amount}})
    await conn.commit();
    conn.release();
  } catch(error){
    await conn.rollback();
    conn.release();

    sendResponse(res,{statusCode:500, message:'Booking failed', data: error.message})
   

    }


    }


  
  // GET /api/bookings
  const getBookings = async (req, res) => {
    try {
      const user_id = req.user.user_id;
      const [rows] = await getUserBookings(user_id);
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
    }
  };
  
  // GET /api/bookings/:id
  const getBookingDetails = async (req, res) => {
    try {
      const booking_id = req.params.id;
      const [rows] = await getBookingById(booking_id);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.status(200).json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch booking', details: err.message });
    }
  };
  
  // DELETE /api/bookings/:id
  const cancelBooking = async (req, res) => {
    try {
      const booking_id = req.params.id;
      await deleteBooking(booking_id);
      res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to cancel booking', details: err.message });
    }
  };
  
  module.exports = {
    bookEventTicket,
    getBookings,
    getBookingDetails,
    cancelBooking,
    
  };
  