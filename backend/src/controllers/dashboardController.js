const asyncErrorHandler = require("../utils/asyncErrorHandler");
const {getEventsInfo,getBookingInfo,updateEventInfo,deleteEvent,deleteBooking,getAttendeeInfo,deleteAttendee,getVenueInfo, updateVenueInfo,addNewVenue,getOrganizerInfo,updateVerifStatus} = require("../models/dashboardModel");
const sendResponse = require("../utils/sendResponse");
// const {} = require('../')


const events = asyncErrorHandler( async(req,res,next) => {

    const event_info = await getEventsInfo();
    sendResponse(res,{data:event_info})

}

)

const bookings = asyncErrorHandler( async(req,res,next) => {

    const booking_info = await getBookingInfo();
    sendResponse(res,{data:booking_info})

}

)

const attendees = asyncErrorHandler(async(req,res,next) => {
    const attendee_info = await getAttendeeInfo();
    sendResponse(res,{data:attendee_info})
})

const venues = asyncErrorHandler(async(req,res,next) => {
    const venue_info = await getVenueInfo();
    sendResponse(res,{data:venue_info})

})

const organizers = asyncErrorHandler(async(req,res,next) => {
    const organizer_info = await getOrganizerInfo();
    sendResponse(res,{data:organizer_info})
})
const formatDateTimeForMySQL = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    // Set default time to 00:00:00
    return `${year}-${month}-${day} 00:00:00`;
  };

const updateEvent = asyncErrorHandler(async(req,res,next) => {
    const event_id = req.params.id
    
    const {name,date,organizer,status} = req.body 
    const start_date = formatDateTimeForMySQL(date)
    const updateEvent = await updateEventInfo(name,start_date,status,event_id,organizer)
    sendResponse(res,{data:updateEvent,message:'Update Successful'})
})

const updateVenue = asyncErrorHandler(async(req,res,next) => {
    const venue_id = req.params.id
    
    const {name,address,country,postal_code,capacity,contact_phone,contact_email} = req.body 
   
    const updateVenue = await updateVenueInfo(name,address,country,postal_code,capacity,contact_phone,contact_email,venue_id)
    sendResponse(res,{data:updateVenue,message:'Venue Update Successful'})
})


const updateVerificationStatus = asyncErrorHandler(async(req,res,next) => {
    const verif_id = req.params.verifId;
    const {verification_status} = req.body;
    console.log("Verification ID: ", verif_id , "Verification_status: ",verification_status)
    const result = await updateVerifStatus(verif_id,verification_status)
    sendResponse(res,{data:result})
})

const newVenue = asyncErrorHandler(async(req,res,next) => {
    const {name,address,country,postal_code,capacity,contact_phone,contact_email} = req.body
    console.log(req.body)
    const result = await addNewVenue(name,address,country,postal_code,capacity,contact_phone,contact_email)
    sendResponse(res,{data:result})
})


const eventDeletion = asyncErrorHandler(async(req,res,next) => {
    const event_id = req.params.id;
    const result = await deleteEvent(event_id);
    sendResponse(res,{data:result,message:"Event deleted successfully"})

})



const bookingDeletion = asyncErrorHandler(async(req,res,next)=> {
      const booking_id = req.params.id;
      const result = await deleteBooking(booking_id);
      sendResponse(res,{data:result,message:"Booking deleted successfully"})
})
const attendeeDeletion = asyncErrorHandler(async(req,res,next)=> {
    const  user_id = req.params.id;
    const  booking_id = req.params.bookingId;
    const result = await deleteAttendee(user_id,booking_id);
    sendResponse(res,{data:result,message:"Attendee deleted successfully"})
})
module.exports = {events,bookings,updateEvent,eventDeletion, bookingDeletion,attendees,attendeeDeletion,venues,updateVenue,newVenue,organizers,updateVerificationStatus}