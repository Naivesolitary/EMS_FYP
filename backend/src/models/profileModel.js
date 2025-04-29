const  db = require('../config/db')

const getUserInfo = async(user_id) => {
  
    const [result] = await db.execute(`SELECT u.name,u.email,u.phone,u.role,p.image_url FROM users u JOIN profile_images p
      ON u.user_id = p.user_id WHERE u.user_id = ?  `,[user_id])
    // return result[0]
    return result[0]
    

}


const getFavorites = async(user_id) => {
  const [result] = await db.execute(` SELECT e.title, e.start_datetime, v.address from events e join favorites f ON e.event_id = f.event_id JOIN venues v ON v.venue_id = e.venue_id WHERE f.user_id = ?`,[user_id])
  return result;
}


const getBookings = async(user_id) => {
  const [result] = await db.execute(` select e.title, b.booking_id, b.booking_date,b.total_amount, t.ticket_type from events e JOIN bookings b ON e.event_id = b.event_id JOIN tickets t ON t.event_id = e.event_id WHERE user_id = ?`,[user_id])
  return result;
}

// SELECT e.title, e.start_datetime, v.address from events e join favorites f ON e.event_id = f.event_id JOIN venues v ON v.venue_id = e.venue_id WHERE f.user_id = 34; this is for favourites
// select e.title, b.booking_date,b.total_amount, t.ticket_type from events e JOIN bookings b ON e.event_id = b.event_id JOIN tickets t ON t.event_id = e.event_id WHERE user_id = 34; this on for booked events by a user.



const updateUser = async (userId, fields) => {
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) return; // Nothing to update

  // Dynamically build SET clause
  const setClause = keys.map((key) => `${key} = ?`).join(', ');

  const sql = `UPDATE users SET ${setClause} WHERE user_id = ?`;
  await db.execute(sql, [...values, userId]);
};

const uploadProfileImage = async (userId, imageUrl) => {
  const sql = `
    INSERT INTO profile_images (user_id, image_url) 
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE image_url = VALUES(image_url)
  `;
  await db.execute(sql, [userId, imageUrl]);
};


module.exports = {updateUser,uploadProfileImage,getUserInfo,getFavorites,getBookings}