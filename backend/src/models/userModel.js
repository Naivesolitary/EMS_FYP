const bcrypt = require('bcrypt')
const db = require('../config/db')
// const { get } = require('../routes/authRoutes')


const getAllUser = async() => {
    
    const [result] = await db.execute('SELECT * FROM users')
    return result

}


// ------- Check Blacklisted_Token
const getBlacklist = async(token,tokenType = 'access') =>{
    const [result] = await db.execute(`SELECT * FROM blacklisted_tokens WHERE token = ? AND token_type = ?`,[token,tokenType]);
    // const blacklisted_data = result[0]
    console.log(result)
    console.log(result.length)
    if (result.length === 0) return null;
    return result;


}


// ---  Add to BlackList

const addToBlacklist = async(token,exp,tokenType = 'access') => {
    await db.execute(`INSERT INTO blacklisted_tokens (token, expires_at,token_type) VALUES (?, ?,?)`,[token,exp,tokenType]);
    // return {msg: 'successfully black-listed'}
}


// Clean up expired tokens
const cleanupExpiredTokens = async() => {
    const query = `
    DELETE FROM blacklisted_tokens WHERE expires_at < NOW()`
    const [result] = await db.execute(query)
    console.log(` cleaned up ${result.affectedRows} expired tokens`);
    return result
}






 

const getUserByid =  async(id) => {
    
    const [result] = await db.execute('SELECT * FROM users where id = ? ',[id])
    return result[0]

}
const saveUser =  async(details) => {
    const {name,email,password,phone,role} = details;
    console.log("phone Number: ", phone)
    const [result] = await db.execute('INSERT INTO users (name,email,password,phone,role) VALUES (?,?,?,?,?)',[name, email, password,phone,role])
    return {id: result.insertId, name, email, role, password}


}

const getUser = async(data) => {
    const {email,password} = data
    const [result] = await db.execute('SELECT user_id, email, password, role from users WHERE email = ? ',[email]);
    // console.log('select query result: ',result)
    const user = result[0]
    console.log(result.length)
    console.log("user: ", user)
    if (result.length === 0) return null;
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log(isPasswordCorrect)
    if (!isPasswordCorrect) return null ;
    return  user 

    


}

module.exports = {
    saveUser, getUser, getAllUser
    ,getUserByid,getBlacklist,addToBlacklist,
    cleanupExpiredTokens
}