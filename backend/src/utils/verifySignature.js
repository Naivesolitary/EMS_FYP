const CryptoJS = require('crypto-js')

const decodeBase64 = (encoded) => {
    const decoded = Buffer.from(encoded,'base64').toString('utf-8');
    return JSON.parse(decoded)
}

//transaction_code,status,total_amount,transaction_uuid,product_code,signed_field_names
const generateSignature = (data, secretKey) => {
    const fieldNames = data.signed_field_names.split(',')
    const signaturePayload  = fieldNames.map(field => `${field}=${data[field]}`).join(',');
    console.log("Signature Payload String:", signaturePayload);

    // const signaturePayload  = `${data.transaction_code},${data.status},${data.total_amount},${data.transaction_uuid},${data.product_code},${data.signed_field_names}`;
    const hash = CryptoJS.HmacSHA256(signaturePayload,secretKey)
    
    return CryptoJS.enc.Base64.stringify(hash)
}

module.exports = {
     decodeBase64,
     generateSignature
}