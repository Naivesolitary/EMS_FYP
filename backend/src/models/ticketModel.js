const db = require('../config/db');


const createTicket = async(ticketData) => {
    const {
        event_id,
        ticket_type,
        price,
        total_quantity,
        remaining_quantity,
        sales_start,
        sales_end
      } = ticketData;

      
    
      const ticket_info = await db.execute(`
        INSERT INTO tickets (
          event_id, ticket_type, price, total_quantity, remaining_quantity, sales_start, sales_end
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [event_id, ticket_type, price, total_quantity, remaining_quantity, sales_start, sales_end]);

      return ticket_info[0].insertId
    

}

/// checked 
const getTicketById = async(conn,ticket_id) => {
  const [ticket] = await conn.execute(`SELECT * FROM tickets WHERE ticket_id = ?`,[ticket_id])
  console.log(ticket)
  return ticket[0]



}



const getSelectedTicket = async(ids) => {
  const [tickets] = await db.execute(` SELECT ticket_id, price, remaining_quantity FROM tickets WHERE ticket_id IN (${ids})`)
  return tickets
}
  // console.log(ticket)












module.exports = {
    createTicket,getTicketById,getSelectedTicket
}