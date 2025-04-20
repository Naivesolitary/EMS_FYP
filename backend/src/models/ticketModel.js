const db = require('../config/db');


const createTicket = async (sales_start, sales_end, tickets, event_id) => {
    console.log(sales_start,sales_end)
    if (!tickets || tickets.length === 0) return [];
  
    // Prepare placeholder string: (?, ?, ?, ?, ?, ?, ?), ...
    const placeholders = tickets.map(() => `(?, ?, ?, ?, ?, ?, ?)`).join(',');
  
    // Prepare values array: flatten all ticket data
    const values = tickets.flatMap(ticket => {
      const {
        type: ticket_type,
        price,
        quantity: total_quantity
      } = ticket;
  
      const remaining_quantity = total_quantity;
  
      return [
        event_id,
        ticket_type,
        price,
        total_quantity,
        remaining_quantity,
        sales_start,
        sales_end
      ];
    });

    console.log('Placeholders:', placeholders);
    console.log('Values:', values);

  
    const result = await db.execute(
      `
        INSERT INTO tickets (
          event_id, ticket_type, price, total_quantity, remaining_quantity, sales_start, sales_end
        ) VALUES ${placeholders}`,values)
        console.log(result) 
        return result[0]   
        

   
    // console.log(result,values)  
    // await db.execute(result, values);  
  
    // return result; // first inserted ID (bulk insert only gives this)
  };
  

/// checked 
const getTicketById = async(conn,ticket_id) => {
  const [ticket] = await conn.execute(`SELECT * FROM tickets WHERE ticket_id = ?`,[ticket_id])
  console.log(ticket)
  return ticket[0]



}


const getTicketInfo = async(event_id) => {

  const res = await db.execute(`
    SELECT * FROM tickets WHERE event_id = ?`,[event_id]);
    console.log(res)

    return res
  // console.log(res)  

}



const getSelectedTicket = async(ids) => {
  const [tickets] = await db.execute(` SELECT ticket_id, price, remaining_quantity FROM tickets WHERE ticket_id IN (${ids})`)
  return tickets
}
  // console.log(ticket)












module.exports = {
    createTicket,getTicketById,getSelectedTicket,getTicketInfo
}