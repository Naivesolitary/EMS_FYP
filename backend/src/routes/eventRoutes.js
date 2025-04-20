const express = require('express');
const router = express.Router();
const {createEvent,getEvents,deleteEvent, getEventByid, updateEvent,ticket,images} = require('../controllers/eventController')
const {getImages} = require('../models/eventModel')
const {checkTicket,ticketById,} = require('../controllers/ticketController')
const {bookEventTicket} = require('../controllers/bookingController')
const upload = require('../middlewares/uploadMiddleware')



router.route('/').get(getEvents)
router.route('/images/:eventid').get(images)
router.post('/',upload.array('images',10),createEvent)
// router.post('/',createEvent)
router.delete('/',deleteEvent)
router.route('/:id').get(getEventByid).patch(updateEvent).delete(deleteEvent);
router.route('/:id/tickets').get(ticketById).post(ticket);
router.route('/:eventid/ticket').get(checkTicket)
router.route('/:eventId/bookings').post(bookEventTicket)
// router.post('/:id/booking')


module.exports = router


