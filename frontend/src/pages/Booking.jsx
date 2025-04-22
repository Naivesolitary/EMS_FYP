"use client"

import { useState, useEffect, useRef } from "react"
import { FiX, FiLoader, FiMinus, FiPlus, FiCalendar, FiMapPin, FiCreditCard, FiCheckCircle } from "react-icons/fi"
import Payment from "./Payment";

export default function  Booking({ isOpen, onClose, event, onSubmit }) {
  const {event_id, tickets} = event;
  const [events,setEvents] = useState(event);
  const [fullName,setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedTickets, setSelectedTickets] = useState({})
  const [paymentFormData,setPaymentFormData] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const modalRef = useRef(null)

  console.log("Console from Booking Modal , Event: ",event,tickets)
  console.log('selected tickects: ',selectedTickets)
  tickets.forEach((ticket) =>{

    console.log('remaining tickets before:', ticket.remaining_quantity)
  })
  
  

  // Calculate total amount
  const totalAmount = tickets.reduce((total, ticket) => {
    return total + (selectedTickets[ticket.ticket_id] || 0) * ticket.price
  }, 0)

  console.log("Total Amount: ",totalAmount)
  // Handle click outside to close modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  function formatPrice(price) {
    if (!price) return "Price not available";
    try {
      return new Intl.NumberFormat("ne-NP", {
        style: "currency",
        currency: "NPR",
      }).format(price);
    } catch {
      return `NPR ${price}`; // Fallback if formatting fails
    }
  }


  // const makePayment = () => {

  //   setPayment({
  //     fullName,
  //     phoneNumber,
  //     selectedTickets,
  //     allTickets : tickets,
  //     totalAmount
  //   })

  
  // Handle escape key to close modal
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isOpen, onClose])


  const handleTicketChange = (ticketId, quantity) => {
  const updatedQuantity = Math.max(0, quantity);

  // Get the previous quantity before updating state
  const previousQuantity = selectedTickets[ticketId] || 0;

  // Update selected tickets
  setSelectedTickets((prev) => ({
    ...prev,
    [ticketId]: updatedQuantity,
  }));

  // Update remaining quantity
  setEvents((prevEvent) => {
    const updatedTickets = prevEvent.tickets.map((ticket) => {
      if (ticket.ticket_id === ticketId) {
        return {
          ...ticket,
          remaining_quantity: ticket.remaining_quantity - (updatedQuantity - previousQuantity),
        };
      }
      return ticket;
    });

    return {
      ...prevEvent,
      tickets: updatedTickets,
    };
  });
};


  const validateForm = () => {
    const newErrors = {}

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^\d{10}$/.test(phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid phone number"
    }

    const hasTickets = Object.values(selectedTickets).some((qty) => qty > 0)
    if (!hasTickets) {
      newErrors.tickets = "Please select at least one ticket"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    console.log('valid form.....')

    setIsSubmitting(true)
    try {
      const result = await onSubmit({
        fullName,
        phoneNumber,
        selectedTickets,
        allTickets : tickets,
        totalAmount
      })
      console.log('Result checking in Booking: ', result)
      if (result?.success){
        setPaymentFormData(result.paymentData)

      }
    } catch (error) {
      console.error("Error submitting booking:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

 


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-[520px] max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        style={{ animation: "modalFadeIn 0.3s ease-out" }}
      >
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 pt-12 pb-10">
          {/* Decorative circles */}
          <div className="absolute top-12 right-12 w-24 h-24 rounded-full bg-white opacity-5"></div>
          <div className="absolute top-6 right-28 w-16 h-16 rounded-full bg-white opacity-5"></div>

          <button
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full bg-white/10 p-1.5 backdrop-blur-sm transition-all hover:bg-white/20 focus:outline-none"
          >
            <FiX className="h-4 w-4 text-white" />
            <span className="sr-only">Close</span>
          </button>

          <h2 className="text-sm font-medium uppercase tracking-wider text-purple-200">Book Tickets</h2>
          <p className="text-2xl font-bold mt-1">{event.name}</p>

          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center">
              <FiCalendar className="h-4 w-4 mr-2 text-purple-200" />
              <p className="text-sm text-purple-100">{event.startDate}</p>
            </div>
            <div className="flex items-center">
              <FiMapPin className="h-4 w-4 mr-2 text-purple-200" />
              <p className="text-sm text-purple-100">{event.location.address}</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-8 space-y-8 bg-white">
          {/* Personal Information */}
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-gray-800 flex items-center">
              <span className=" w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center mr-2">
                1
              </span>
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-gray-700 block">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full h-12 pl-4 pr-10 rounded-xl border ${
                      errors.fullName ? "border-red-300" : "border-gray-200"
                    } bg-gray-50 focus:border-purple-300 focus:ring focus:ring-purple-100 focus:outline-none transition-all`}
                  />
                  {fullName && (
                    <FiCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>
                {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 block">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                    className={`w-full h-12 pl-4 pr-10 rounded-xl border ${
                      errors.phoneNumber ? "border-red-300" : "border-gray-200"
                    } bg-gray-50 focus:border-purple-300 focus:ring focus:ring-purple-100 focus:outline-none transition-all`}
                  />
                  {phoneNumber && phoneNumber.length >= 10 && (
                    <FiCheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>
                {errors.phoneNumber && <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>}
              </div>
            </div>
          </div>

          {/* Ticket Selection */}
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-gray-800 flex items-center">
              <span className=" w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center mr-2">
                2
              </span>
              Select Tickets
            </h3>
            {errors.tickets && <p className="text-sm text-red-500 mt-1">{errors.tickets}</p>}
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.ticket_id}
                  className="relative overflow-hidden p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all"
                >
                  {/* Decorative element */}
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-400 to-indigo-500"></div>

                  <div className="flex items-center justify-between">
                    <div className="pl-3">
                      <p className="font-semibold text-gray-800">{ticket.ticket_type}</p>
                      <p className="text-sm text-gray-500 mt-1">{formatPrice(Number(ticket.price).toFixed(2))} per ticket</p>
                      {/* {ticket.description && <p className="text-xs text-gray-400 mt-1">{ticket.description}</p>} */}
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className={`flex items-center justify-center h-9 w-9 rounded-l-lg border border-r-0 transition-colors ${
                          (tickets[ticket.ticket_id] || 0) <= 0
                            ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
                            : "border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100"
                        }`}
                        onClick={() => handleTicketChange(ticket.ticket_id, (selectedTickets[ticket.ticket_id] || 0) - 1)}
                        disabled={(selectedTickets[ticket.ticket_id] || 0) <= 0}
                      >
                        <FiMinus className="h-4 w-4" />
                      </button>
                      <div className="flex items-center justify-center h-9 min-w-[2.5rem] border-y border-purple-200 bg-white text-sm font-medium">
                        {selectedTickets[ticket.ticket_id] || 0}
                      </div>
                      <button
                        type="button"
                        className="flex items-center justify-center h-9 w-9 rounded-r-lg border border-l-0 border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                        onClick={() => handleTicketChange(ticket.ticket_id, (selectedTickets[ticket.ticket_id] || 0) + 1)}
                        disabled = {(selectedTickets[ticket.ticket_id] || 0) >= ticket.remaining_quantity}
                      >
                        <FiPlus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-gray-800 flex items-center">
              <span className=" w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center mr-2">
                3
              </span>
              Summary
            </h3>
            <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-5 border border-gray-200">
          
              { Object.entries(selectedTickets).map(([ticketIdStr, quantity]) =>  {
                const ticketId = Number(ticketIdStr);
                if(quantity <= 0) return null;
                const ticket = tickets.find(t => t.ticket_id === ticketId)
                if (!ticket) return null;
                return (
                  <div key={ticketId} className="flex justify-between text-sm py-2">
                    <span className="text-gray-700">
                        {ticket.ticket_type} × {quantity}
                      </span>
                      <span className="font-medium text-gray-900">
                       {formatPrice(ticket.price * quantity)}
                    </span>
                  </div>

                )
              }
              )}
              <div className="flex justify-between font-medium pt-3 mt-2 border-t border-gray-200">
                <span className="text-gray-800">Total</span>
                <span className="text-xl font-bold text-purple-700">{formatPrice(totalAmount.toFixed(2))}</span>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 p-5 border border-purple-100">
              <div className="flex items-center">
                <FiCreditCard className="h-5 w-5 text-purple-500 mr-2" />
                <p className="text-sm font-medium text-gray-700">Payment Method</p>
              </div>
              <div className="flex items-center mt-3 bg-white p-3 rounded-lg border border-purple-100">
                <div className="h-8 w-8 rounded-md bg-green-500 mr-3 flex items-center justify-center text-white">
                  <span className="text-xs font-bold">e</span>
                </div>
                <div>
                  <p className="text-sm font-medium">eSewa</p>
                  <p className="text-xs text-gray-500">Fast & secure payment</p>
                </div>
                <div className="ml-auto">
                  <FiCheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || totalAmount <= 0}
            className={`w-full h-12 rounded-xl font-medium text-base transition-all ${
              totalAmount > 0
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-200"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <FiLoader className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </span>
            ) : (
              "Proceed to Payment"
            )}
          </button>
          <button
            onClick={onClose}
            className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
        {console.log('Payment  data  from: ',paymentFormData)}

        {paymentFormData && <Payment paymentData={paymentFormData} />}
      </div>
    </div>
  )
}
