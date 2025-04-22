
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const {decodeBase64,generateSignature} = require('../utils/verifySignature')
const {} = require('../models/paymentModel')
const {updateBookingStatus,addPaymentId,getPaymentId} = require('../models/bookingModel');
const {getBookingId,updatePaymentStatus} = require('../models/paymentModel')
require('dotenv').config()

const verifyPayment = async(req,res,next) => {
    const fullUrl = req.originalUrl;
    console.log(fullUrl)
    const encodedData = req.query.data;
    console.log('Incoming query params:', req.query);
    const transaction_uuid = req.params.transaction_uuid
    
    console.log('Encoded Data: ',encodedData)
  
 
    if(!encodedData || !transaction_uuid){
        res.redirect(`${process.env.FRONTEND_URL}/payment-failed`)
    }


    // const decoded = Buffer.from(encodedData,'base64').toString('utf-8');
    const parsedData = decodeBase64(encodedData);
    console.log("Parsed Data: ",parsedData)
    console.log("Decoded Payload:", JSON.stringify(parsedData, null, 2));
    console.log("signed_field_names:", parsedData.signed_field_names);
    const {status,signature} = parsedData

    switch(parsedData.status){
        case "COMPLETE":
            try{

                const booking_id = await getBookingId(transaction_uuid);
                console.log('booking_id for verification: ',booking_id)
                if (!booking_id) {
                    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
                }

                const secretKey = process.env.ESEWA_SECRET;
                const expectedSignature = generateSignature(parsedData,secretKey)
            
                if (!signature || !expectedSignature || signature !== expectedSignature) {
                    console.log('Signature mismatch', { signature, expectedSignature });
                    return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
                  }

                  await updatePaymentStatus('paid',transaction_uuid,);
                 await updateBookingStatus('confirmed',booking_id);
                 const payment_id = await getPaymentId(booking_id)
                 await addPaymentId(booking_id,payment_id)
                return res.redirect(`${process.env.FRONTEND_URL}/payment-success`)


                
            
    }catch(err){
        console.log('Error verifying payment: ',err.message);
        return res.redirect(`${process.env.FRONTEND_URL}/payment-failed`)
    }

    case "PENDING":
        break;

    case "FULL_REFUND":
        break;
        
    case "CANCELED":
            break;    
   

    


 
}

}









module.exports = {verifyPayment}