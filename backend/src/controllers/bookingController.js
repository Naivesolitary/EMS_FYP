const {updateBookingTotal,createBooking,reduceTicketQuantity,insertBookingItem,getPaymentId,addPaymentId} = require('../models/bookingModel');
const {getBookingId} = require('../models/paymentModel') 
// const uuid4 = require('uuidv4')
const { v4: uuidv4 } = require("uuid");
require('dotenv').config()

const CryptoJS = require('crypto-js')
const {getTicketById} = require('../models/ticketModel');
const {savePayment} = require('../models/paymentModel')
const ApiError = require('../utils/ApiError');
const asyncErrorHandler = require('../utils/asyncErrorHandler')
require('dotenv').config()
const db = require('../config/db');
const { response } = require('express');
const sendResponse = require('../utils/sendResponse');
  




    // FINAL:  TESTED  SUCCESSFULLY   Create New Booking  # PAYMENT ID TO BE INSERTED
    const newBooking = async (req, res) => {
      let conn;
      try{
      // const user_id = 2;
      const event_id = req.params.eventId;
      const {full_name,phone_number, tickets} = req.body;
      // console.log('REQUEST OBJECT',req)
     
  
       conn = await db.getConnection();
  
      await conn.beginTransaction();
  
      const bookingId = await createBooking(conn,user_id,event_id,full_name,phone_number);
      //  console.log(`1st query: ${conn}`,bookingId)
      console.log(tickets)
      let calculatedTotal = 0;
      for(const item of tickets){
        const {ticket_id, quantity,price} = item
        calculatedTotal += price * quantity;
         const ticket = await getTicketById(conn,ticket_id);
         console.log(`2nd Query: ${conn}`,ticket)
         if (!ticket) {
          throw new ApiError(404,`Ticket ID ${ticket_id} not found`);
        }
  
        if(ticket.remaining_quantity < quantity ){
           throw new ApiError(401,`Not enough tickets for Ticket ID ${ticket_id}. Requested: ${quantity}, Available: ${ticket.remaining_quantity}`)
  
        }
    
        const isBookingItemInserted = await insertBookingItem(conn, bookingId, ticket_id, quantity, price);
        console.log('new Book item Inserted',isBookingItemInserted)
        console.log("Reducing quantity", { ticket_id, quantity });
        
        const isQntyReduced = await reduceTicketQuantity(conn, ticket_id, quantity);
        // calculatedTotal += price * quantity
        console.log('Quantity Reduced: ',isQntyReduced)
       

      }
      await updateBookingTotal(conn, bookingId, calculatedTotal);
      const transaction_uuid = uuidv4()
      await savePayment(conn,bookingId,user_id,calculatedTotal,transaction_uuid)

      
     


        // PREPARE FOR esewa PAYMENT DATA
        const paymentData = {
          amount : calculatedTotal.toString(),
          tax_amount : "0",
          total_amount : calculatedTotal.toString(),
          transaction_uuid,
          product_code : process.env.ESEWA_PRODUCT_CODE,
          product_service_charge: "0",
          product_delivery_charge : "0",
          // success_url : "https://developer.esewa.com.np/success",
          success_url : `${process.env.BASE_URL}/api/payment/verify-esewa/${transaction_uuid}`,
          failure_url : "https://developer.esewa.com.np/failure",
          signed_field_names: "total_amount,transaction_uuid,product_code"

        }
        // console.log("hello World")

        const message = `total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${paymentData.product_code}`
        const hash = CryptoJS.HmacSHA256(message,process.env.ESEWA_SECRET);
        const hashedSignature = CryptoJS.enc.Base64.stringify(hash);
        paymentData.signature = hashedSignature

        console.log(paymentData)

    
        await conn.commit();
        conn.release();
      
      sendResponse(res,{statusCode:201,message: 'Booking successful', data:{paymentData,total_amount: calculatedTotal}})
    } catch(error){
      if(conn){
        await conn.rollback();
        conn.release();
    

      }
      console.log("Booking Error:",error)
    
      sendResponse(res,{statusCode:500, message:'Booking failed', data: error.message})
     
  
      }
  
  
      }


const paymentId = async (req, res) => {
  try {
    const booking_id = req.params.id;
    const rows = await getPaymentId(booking_id) ;
    console.log(rows)
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
  }
};
  
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


  // THIS IS ONLY FOR TESTING
  const booking_id = async(req,res) => {
    const id = req.params.id
    console.log("T-id:" , id)
    const booking_id =  await getBookingId(id)
    console.log("Booking id: ", booking_id)
    sendResponse(res,{data:{booking_id}})
  }


  // const bookingStatus = async(req,res) => {

  // }
  
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
  
    getBookings,
    getBookingDetails,
    cancelBooking,
    newBooking,
    booking_id,
    paymentId
    
  };
  