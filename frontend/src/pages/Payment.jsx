import React, { useEffect, useState } from 'react'


export default function Payment({paymentData}) {
  console.log("This is teh paymentData from Payment Component: ", paymentData)
  useEffect(() => {
    const form = document.getElementById("esewaPaymentForm")
    if (form && paymentData) {
      // Populate form fields
      Object.entries(paymentData).forEach(([key, value]) => {
        if (form.elements[key]) {
          form.elements[key].value = value
        }
      })
      form.submit()
    }
  }, [paymentData])
 


  


  return (
    <>
      
<form id='esewaPaymentForm' action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST" className='hidden'>
 <input type="text" id="amount"   name="amount" />
 <input type="hidden" id="tax_amount" name="tax_amount" />
 <input type="hidden" id="total_amount" name="total_amount"/>
 <input type="hidden" id="transaction_uuid" name="transaction_uuid"/>
 <input type="hidden" id="product_code" name="product_code" />
 <input type="hidden" id="product_service_charge" name="product_service_charge" />
 <input type="hidden" id="product_delivery_charge" name="product_delivery_charge" />
 <input type="hidden" id="success_url" name="success_url" value="https://developer.esewa.com.np/success"/>
 <input type="hidden" id="failure_url" name="failure_url" value="https://developer.esewa.com.np/failure" />
 <input type="hidden" id="signed_field_names" name="signed_field_names" />
 <input type="hidden" id="signature" name="signature"/>
 <input value="Submit" type="submit"/>
 </form>
 
</>
  )
}
