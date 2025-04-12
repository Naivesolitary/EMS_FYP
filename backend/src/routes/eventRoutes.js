const express = require('express');
const router = express.Router();
const {createEvent,getEvents,deleteEvent, getEventByid, updateEvent,ticket} = require('../controllers/eventController')
const {checkTicket,ticketById} = require('../controllers/ticketController')
const {bookEventTicket} = require('../controllers/bookingController')



router.route('/').get(getEvents).post(createEvent).delete(deleteEvent)
router.route('/:id').get(getEventByid).patch(updateEvent).delete(deleteEvent);
router.route('/:id/ticket').get(ticketById).post(ticket);
router.route('/:eventId/bookings').post(bookEventTicket)
// router.post('/:id/booking')


module.exports = router


