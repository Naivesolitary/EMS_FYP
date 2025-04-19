// "use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { BASE_URL } from "../config";
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaMapMarkerAlt, 
  FaStar, 
  FaTicketAlt, 
  FaTimes 
} from "react-icons/fa";


export function EventModal({ isOpen, onClose, event }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  console.log('event obj from event modal: ',event)
  

  useEffect(() => {
    setMounted(true);

    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose]);

  const nextImage = () => {
    setActiveImageIndex((prev) => 
      prev === event.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => 
      prev === 0 ? event.images.length - 1 : prev - 1
    );
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ne-NP", {
      style: "currency",
      currency: "NPR",
    }).format(price);
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      aria-modal="true"
      role="dialog"
      aria-labelledby="event-modal-title"
    >
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200 mx-4">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-10 rounded-full bg-white/90 p-2 text-gray-600 shadow-md hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Close modal"
        >
          <FaTimes className="h-5 w-5" />
        </button>

        {/* Image section */}
        <div className="relative aspect-video w-full bg-gray-100 px-4 pt-4">
          {event.images.length > 1 ? (
            <>
              <div className="relative h-full w-full overflow-hidden rounded-lg">
                {event.images.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      index === activeImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img 
                      src={`${BASE_URL}${image.image_url}`} 
                      alt={image.alt} 
                      className="h-full w-full object-contain" 
                    />
                  </div>
                ))}
              </div>

              <div className="absolute inset-0 flex items-center justify-between px-4">
                <button
                  onClick={prevImage}
                  className="rounded-full bg-white/80 hover:bg-white p-2 shadow-md"
                  aria-label="Previous image"
                >
                  <FaArrowLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="rounded-full bg-white/80 hover:bg-white p-2 shadow-md"
                  aria-label="Next image"
                >
                  <FaArrowRight className="h-5 w-5" />
                </button>
              </div>

              <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5">
                {event.images.map((_, index) => (
                  <button
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === activeImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/60 hover:bg-white/80"
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          ) : (
            <img
              src={`${BASE_URL}${event.images[0].image_url}`} 
              alt={event.images[0].alt || event.name}
              className="h-full w-full object-cover rounded-lg"
            />
          )}
        </div>

        {/* Content section */}
        <div className="p-6 md:p-8">
          <h2 id="event-modal-title" className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            {event.name}
          </h2>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Date & Time</h3>
                <p className="mt-2 text-gray-700">
                  {formatDateTime(event.startDate)}
                  {event.endDate && <> - {formatDateTime(event.endDate)}</>}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Location</h3>
                <p className="mt-2 flex items-start gap-2 text-gray-700">
                  <FaMapMarkerAlt className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                  <a
                    href={event.location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {event.location.address}
                  </a>
                </p>
              </div>
            </div>

            <div className="space-y-4">
            <div></div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tickets</h3>
                {event.tickets.map((ticket,index) => (
                  <div>
                  <p key={index} className="mt-2 flex items-center gap-2 text-gray-700">
                  <FaTicketAlt className="h-4 w-4 text-gray-500" />
                  {ticket.type}
                  <p> {formatPrice(ticket.price)} </p>
                </p>
                </div>
                
                ))}
               
              </div>

            
            </div>
          </div>

          <div>
  {event.tickets.map((ticket, index) => (
    <div key={ticket.id} className="border rounded-md p-3 bg-gray-50">
      <div className="flex justify-between items-center">
        <div className="text-gray-800 font-semibold">{ticket.type}</div>
        <div className="text-gray-700">
          {ticket.available > 0 ? `${ticket.available} tickets left` : 'Sold Out'}
        </div>
      </div>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-lg font-bold text-teal-600">
          {formatPrice(ticket.price)}
        </span>
      </div>

      {/* Conditionally render button based on availability */}
      <button
        disabled={ticket.available === 0}
        className={`mt-3 px-6 py-3 rounded-lg font-medium text-base transition-all ${
          ticket.available > 0
            ? "bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {ticket.available > 0 ? "Book Now" : "Sold Out"}
      </button>
    </div>
  ))}
</div>
          

          <div className="my-6 md:my-8 h-px w-full bg-gray-200"></div>

          {/* Reviews section */}
          <div>
            <div className="mb-4 md:mb-6 flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">Reviews</h3>
            </div>

            {event.reviews.length > 0 ? (
              <div className="space-y-4 md:space-y-6">
                {event.reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-4 md:p-6 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-900">{review.name}</h4>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={`h-4 w-4 md:h-5 md:w-5 ${
                              i < review.rating 
                                ? "text-amber-400 fill-amber-400" 
                                : "text-gray-200 fill-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 md:mt-3 text-sm md:text-base text-gray-600">{review.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 md:py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  No reviews yet. Be the first to leave a review!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}