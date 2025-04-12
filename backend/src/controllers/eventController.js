const sendResponse = require('../utils/sendResponse');
const ApiError = require('../utils/ApiError');
const asyncErrorHandler = require('../utils/asyncErrorHandler')
const {event,eventById, allEvents,eventUpdate,deleteEventById} = require('../models/eventModel')
const {createTicket} = require('../models/ticketModel')

//  creates an Event 
const createEvent = asyncErrorHandler(async (req,res,next) => {
      eventData = req.body;
    const newEvent = await event(eventData) ;
    if(!newEvent) throw new ApiError(500,'Create Event Failed :(')
    sendResponse(res,{message:'Event Created Successfully!!!',data:newEvent})
    
})



//  get all the events
const getEvents = asyncErrorHandler(async(req,res,next) => {
    const events = await allEvents();
    if(!events) throw new ApiError(404,'Events not found')
    sendResponse(res,{data:events,message:'fetched all the events'})    


})


// get event by id
const getEventByid = asyncErrorHandler(async(req,res,next) => {
    const eventId = req.params.id;
    const event = await eventById(eventId);
    if(!event) throw new ApiError(404,'Event not found for that id')
    sendResponse(res,{data:event,message:'successfully fetch event!'})    

})



//  HERE new ticket handler
const ticket = asyncErrorHandler(async(req,res,next) => {
    const event_id = req.params.id;
    const ticketData = {...req.body,event_id};
    const newTicket = await createTicket(ticketData);
    if(!newTicket) throw new ApiError(500,'Failed to create ticket')
        sendResponse(res,{statusCode:201, data:newTicket,message:'Ticket created successfully'})
        
})


// update event 

const updateEvent = asyncErrorHandler(async() => {
    const event_id = req.params.id;
    const eventInfo = req.body;
    const updatedEvent = await eventUpdate(eventInfo,event_id)
    if(!updatedEvent) throw new ApiError(404,'Event not found')
     sendResponse(res,{data:{updatedEvent},message:'Event updated successfully!!'})   


})


// delete event
const deleteEvent = asyncErrorHandler(async() => {
    const event_id = req.params.id;
    const deleteInfo = await  deleteEventById(event_id);
    console.log(deleteInfo)
    if(!deleteInfo) throw new ApiError(404,'Event not found!')
    sendResponse(res,{data:deleteInfo,message:'Event deleted successfully'})    

})

// create tickect
// const createEventTicket = asyncErrorHandler(async (req, res) => {
    
//       const event_id = req.params.id;
//       const ticketData = { ...req.body, event_id };
//       const ticketInfo = await createTicket(ticketData);
//       if(!ticketInfo) throw new ApiError(500,'Failed to create ticket')
//       sendResponse(res,{data:ticketInfo,message:'Ticket created successfully'})
//       res.status(201).json({ message: 'Ticket created successfully.' });
   
     

//   });

module.exports = {
    createEvent,
    getEvents,
    getEventByid,
    updateEvent,
    deleteEvent,
    ticket

}