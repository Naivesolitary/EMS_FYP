const express = require('express');
const router = express.Router();
const {createEvent,getEvents,deleteEvent, getEventByid, updateEvent,ticket,images} = require('../controllers/eventController')
const {getImages} = require('../models/eventModel');
const {jwtAuth} = require('../middlewares/jwtAuth')
const {checkTicket,ticketById,} = require('../controllers/ticketController')
const {bookEventTicket,newBooking} = require('../controllers/bookingController')
const upload = require('../middlewares/uploadMiddleware')



router.route('/').get([jwtAuth,getEvents])
router.route('/images/:eventid').get(images)
router.post('/',upload.array('images',10),[jwtAuth,createEvent])
// router.post('/',createEvent)
router.delete('/',deleteEvent)
router.route('/:id').get(getEventByid).patch(updateEvent).delete(deleteEvent);
router.route('/:id/tickets').get(ticketById).post(ticket);
router.route('/:eventid/ticket').get(checkTicket)
// router.route('/:eventId/bookings').post(bookEventTicket)
router.route('/:eventId/bookings').post(newBooking)
// router.post('/:id/booking')


module.exports = router


