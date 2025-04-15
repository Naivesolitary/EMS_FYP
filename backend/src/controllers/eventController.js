const sendResponse = require('../utils/sendResponse');
const ApiError = require('../utils/ApiError');
const path = require('path')
const asyncErrorHandler = require('../utils/asyncErrorHandler')
const {event,eventById, allEvents,eventUpdate,deleteEventById,insertImages} = require('../models/eventModel')
const {createTicket} = require('../models/ticketModel')

//  creates an Event 
const createEvent = asyncErrorHandler(async (req,res,next) => {
      const eventData = JSON.parse(req.body.event);
      console.log(eventData)
      const imageStack = req.files.map(file => ({
        path:path.join('uploads',file.filename),
        filename : file.filename}))
      

    //   const isPrimary = (imageStack.length === 1) ? imageStack.filename: imageStack

    //  const event_id = await event(eventData);
     const event_id = 2;
     if(!event_id) throw new ApiError(500,{message:'Failed to create Event'})
     const {start_datetime:sales_start,end_datetime:sales_end,tickets} = eventData  ; 
    console.log(sales_start,sales_end);
    //  const newTicket = await createTicket(sales_start,sales_end,tickets,event_id)
    //  if (!newTicket)  throw new ApiError(500,{message:'Failed to create Ticket'})
    const imagesToInsert = imageStack.map((img,index) => ({
            event_id,
            path:img.path,
            isPrimary: index === 0

     }))
     const imgs = await insertImages(imagesToInsert)   
    //  console.log(imgs);



    
    // Simulate saving event and images to database (replace with real database logic)
  
    // const newEvent = await event(eventData) ;
    // if(!newEvent) throw new ApiError(500,'Create Event Failed :(')
    sendResponse(res,{message:'Event Created Successfully!!!'})
    
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