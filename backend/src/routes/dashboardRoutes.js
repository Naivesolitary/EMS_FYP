const express = require("express");
const router = express.Router()
const {events,bookings,updateEvent,eventDeletion,bookingDeletion,attendees,attendeeDeletion,venues,updateVenue,newVenue,organizers,updateVerificationStatus} = require('../controllers/dashboardController')

router.get('/events',events)
router.get('/booking',bookings)
router.get('/attendees',attendees)
router.get('/venues',venues)
router.get('/organizers',organizers)
router.post('/venues',newVenue)
router.put('/events/:id',updateEvent)
router.put('/venues/:id',updateVenue)
router.put('/organizers/:verifId',updateVerificationStatus)
router.delete('/events/:id',eventDeletion)
router.delete('/booking/:id',bookingDeletion)
router.delete('/attendee/:id/:bookingId',attendeeDeletion)


module.exports = router