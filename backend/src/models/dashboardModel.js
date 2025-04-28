const db =  require('../config/db')


// ** returns array of events objects
const getEventsInfo = async() => {
    const [result] = await db.execute(`SELECT e.event_id, e.title, e.start_datetime, u.name, e.status, ei.image_url FROM events e JOIN users u ON e.organizer_id = u.user_id JOIN event_images ei ON e.event_id = ei.event_id where ei.is_primary = 1;
`)
   
    return result
}

const getOrganizerInfo = async() => {
    const [result] = await db.execute(`SELECT o.verification_id,u.name, o.verification_notes,o.verification_status from users u JOIN  organizer_verification o ON u.user_id = o.user_id;`)
    return result
}


// ** return array of booking objects
const getBookingInfo = async() => {
    const [result] = await db.execute(`SELECT b.booking_id, e.title, b.name_at_booking, b.booking_date,b.status FROM bookings b JOIN events e ON b.event_id = e.event_id;`)
    return result
}


const getAttendeeInfo = async() => {
    const [result] = await db.execute(`SELECT  b.booking_id,u.user_id,b.name_at_booking, u.email, e.title , b.status  FROM bookings b join events e ON b.event_id = e.event_id join users u on b.user_id = u.user_id;`)
    return result
}

const getVenueInfo = async() => {
    const [result] = await db.execute(`SELECT venue_id, name, address, country, postal_code, capacity, contact_phone, contact_email from venues;`)
    return result
}

const updateVerifStatus = async(verification_id, verification_status) => {
    
    const [result] = await db.execute(`UPDATE organizer_verification SET verification_status = ? WHERE verification_id = ?`,[verification_status,verification_id])
    return result
}


const addNewVenue = async(name,address,country,postal_code,capacity,contact_phone,contact_email) => {
    console.log(name,address,country,postal_code,capacity,contact_phone,contact_email)
    const [result] = await db.execute(`INSERT INTO venues (name,address,country,postal_code,capacity,contact_phone,contact_email) VALUES (?,?,?,?,?,?,?)`,[name,address,country,postal_code,capacity,contact_phone,contact_email])
    return result.insertId
}

const updateEventInfo = async(title,date,status,event_id,organizer) => {
    const [result] = await db.execute(`UPDATE events e
JOIN users u ON e.organizer_id = u.user_id
SET 
    e.title = ?,
    e.start_datetime = ?,
    e.status = ?,
    u.name = ?
    
WHERE 
    e.event_id = ?`,[title,date,status,organizer,event_id])

    return result
}


const updateVenueInfo = async(name,address,country,postal_code,capacity,contact_phone,contact_email,venue_id) => {
    const [result] = await db.execute(`UPDATE venues SET name = ?,address = ?, country =?,
        postal_code = ? , capacity = ?, contact_phone = ? , contact_email = ? WHERE venue_id = ?
`,[name,address,country,postal_code,capacity,contact_phone,contact_email,venue_id])

    return result
}

const deleteEvent = async(event_id) =>{
    const [result] = await db.execute(`DELETE FROM events WHERE event_id = ?`,[event_id]);
    return result
}

const deleteBooking = async(booking_id) =>{
    const [result] = await db.execute(`DELETE FROM bookings WHERE booking_id = ?`,[booking_id]);
    return result
}
const deleteAttendee = async(attendee_id,booking_id) =>{
    const [result] = await db.execute(`DELETE FROM bookings WHERE user_id = ? AND booking_id = ?`,[attendee_id,booking_id]);
    return result
}

module.exports = {getEventsInfo,getBookingInfo,updateEventInfo,deleteEvent,deleteBooking,getAttendeeInfo,deleteAttendee,getVenueInfo,updateVenueInfo,addNewVenue,getOrganizerInfo,updateVerifStatus}