const asyncErrorHandler = require('../utils/asyncErrorHandler');
const sendResponse = require('../utils/sendResponse');
const ApiError = require('../utils/ApiError')
const {getRemainingTickets,getTicketById,getTicketInfo} = require('../models/ticketModel')

const ticket = asyncErrorHandler(async(req,res,next) => {
    const event_id = req.params.id;
    const ticketData = {...req.body,event_id};
    const newTicket = await createTicket(ticketData);
    if(!newTicket) throw new ApiError(500,'Failed to create ticket')
        sendResponse(res,{statusCode:201, data:newTicket,message:'Ticket created successfully'})
        
})

const ticketById = asyncErrorHandler(async(req,res,next) => {
    const ticket_id = req.params.id
    const ticket = await getTicketById(ticket_id);
    if(!ticket) throw new ApiError(404,'Ticket not found ')
    sendResponse(res,{data:ticket,message:'Ticket by id fetched successfully!'})
}) 

const checkTicket = asyncErrorHandler(async(req,res,next) => {
    const event_id = req.params.eventid
    console.log(event_id)
    // const booking_data =req.body // booking data
    const [tickets] = await getTicketInfo(event_id)
    console.log(tickets) 
   
   
    sendResponse(res,{data:tickets,message:'ticket info fetched successfully!'})

})




const ticketAvailStatus = (ticketIdQty,noOfTickets) => {

    return ticketIdQty.filter((ticket) => {

        if(ticket.remaining_quantity >= noOfTickets) return true
        else{
            sendResponse(res,{message:'ticket not available'})
        }
    } ) 




}


module.exports = {
    ticket,checkTicket,ticketById
}