const  db = require('../config/db')

const getUserInfo = async(user_id) => {
  
    const [result] = await db.execute(`SELECT u.name,u.email,u.phone,u.role,p.image_url FROM users u JOIN profile_images p
      ON u.user_id = p.user_id WHERE u.user_id = ?  `,[user_id])
    // return result[0]
    return result[0]
    

}




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


module.exports = {updateUser,uploadProfileImage,getUserInfo}