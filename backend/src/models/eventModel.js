const db = require('../config/db');


const event = async(eventData) => {
 
 const {organizer_id,title,description,category_id,
    start_datetime,end_datetime,venue_id,max_attendees,tickets} = eventData;
    const [{price}] = tickets;
    if (
      !organizer_id ||
      !title ||
      !description ||
      !category_id ||
      !start_datetime ||
      !end_datetime ||
      !venue_id ||
      !max_attendees ||
      !price 
      
    ) {
      return {
        success: false,
        status: 400,
        message: 'Missing required fields'
      };
    }
    // console.log("price : ",price)
    const [result] =  await db.execute(`INSERT INTO events (organizer_id,title,description,category_id,start_datetime,
        end_datetime,venue_id,max_attendees,price) VALUES (?,?,?,?,?,?,?,?,?)`,
        [organizer_id,title,description,category_id,start_datetime,end_datetime,venue_id,max_attendees,price])

    return result.insertId


}

// ----------------- Insert Images ----------------->
const insertImages = async (imagesToInsert) => {
   const placeholders = imagesToInsert.map(() => `(?,?,?)`).join(',');
   const params = imagesToInsert.map((img) => [
    img.event_id, img.path,img.isPrimary


   ]
       

   )

   const result = await db.execute(`Insert into event_images (event_id, image_url, is_primary) VALUES ${placeholders}`,params.flat())
   console.log(result)
   return result




}


const allEvents = async() => {
    const [events] = await db.execute(`   SELECT 
        e.*, 
        u.name AS organizer_name, 
        c.name AS category_name, 
        v.name AS venue_name, v.location AS venue_location
      FROM events e
      JOIN users u ON e.organizer_id = u.user_id
      LEFT JOIN event_categories c ON e.category_id = c.category_id
      JOIN venues v ON e.venue_id = v.venue_id
    `)
    return events[0];
}


const eventById = async(id) => {
    const eventId = id;
    const [result] = await db.execute(`   SELECT 
        e.*, 
        u.name AS organizer_name, 
        c.name AS category_name, 
        v.name AS venue_name, v.location AS venue_location
      FROM events e
      JOIN users u ON e.organizer_id = u.user_id
      LEFT JOIN event_categories c ON e.category_id = c.category_id
      JOIN venues v ON e.venue_id = v.venue_id
      WHERE e.event_id = ?
    `,[eventId])

    return result
}

const eventUpdate = async(eventInfo,eventId) =>{
   
    const {
        title,
        description,
        category_id,
        start_datetime,
        end_datetime,
        venue_id,
        max_attendees,
        price,
        status
      } = eventInfo;

    const [result] = await db.execute(`  UPDATE events
      SET
        title = ?,
        description = ?,
        category_id = ?,
        start_datetime = ?,
        end_datetime = ?,
        venue_id = ?,
        max_attendees = ?,
        price = ?,
        status = ?
      WHERE event_id = ?
    `,[title,description,category_id,start_datetime,end_datetime,venue_id,max_attendees,price,status,eventId])

    return result[0]
}

const deleteEventById = async(eventId) =>{
    const [result] = db.execute(`
        DELETE FROM events WHERE event_id = ?
      `, [eventId])

     return result 
}






module.exports = {
    event,allEvents,eventById,
    eventUpdate,deleteEventById,
    insertImages
   
}