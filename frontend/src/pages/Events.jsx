import Dragonsky from '../images/Dragon Sky.jpg';
import Twilight from '../images/Twilight.png';
import Moon from '../images/Moon.png';
import Cloud from '../images/Cloud.png';
import ClipLoader from 'react-spinners/ClipLoader';
import axios, { axiosPrivate } from  '../services/axios'
import {useAuth} from '../context/AuthContext'

import {BASE_URL} from '../config'
import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaArrowLeft, FaArrowRight, FaDAndDBeyond, FaGlideG,FaRegHeart, FaHeart } from 'react-icons/fa';;


import { EventModal } from '../components/EventModal'; // Add this import
import Booking from './Booking'


// *  NOTES : here selectedRaWEvent state variable tracks the event info without tickets info i.e tickets : [] or before tickects are fetch;

//  

export default function Events() {
  const {auth} = useAuth()
  const {user} = auth
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentLot, setCurrentLot] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedRawEvent, setSelectedRawEvent] = useState(null);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [tickets,setTickets] = useState([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [modalType, setModalType] = useState(null); // 'view' or 'book'

 

  console.log("Fav events: ", favoriteEvents)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const eventsPerLot = 5;
  // console.log(user.id)



  // ------------------ FETCH EVENT DETAILS ---------------------------/
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      setTimeout(async () => {
        try {
          const { data } = await axios.get('/api/events');
          setEvents(data.data);
          console.log(data.data);
        } catch (error) {
          console.error('Error while Fetching Events data', error);
        } finally {
          setIsLoading(false); // Always stop loading no matter what
        }
      }, 800);
    };
  
    loadEvents();
  }, []);

  const toggleFavorite = async (eventId) => {
    setFavoriteEvents(prevFavorites => {
     const updatedFavorites = prevFavorites.includes(eventId)
        ? prevFavorites.filter(id => id !== eventId) // remove if already favorite
        : [...prevFavorites, eventId] // add if not

        localStorage.setItem('favorites',JSON.stringify(updatedFavorites))
        return updatedFavorites
      });
      try {
        const isFavorite = favoriteEvents.includes(eventId);
        await fetch('/api/events/favorites', {
          method: isFavorite ? 'DELETE' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId,userId :user.id }),
        });
      } catch (err) {
        console.error('Failed to update favorites:', err);
      }

    
  };

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavoriteEvents(storedFavorites);
  }, []);
  
  

  



  // ------------
  useEffect(() => {
    let isMounted = true;

    if(isModalOpen && selectedRawEvent){
    const fetchData = async() => {
      try{
              setIsLoadingTickets(true);
             const {data:response} = await axios.get(`${BASE_URL}/api/events/${selectedRawEvent.event_id}/ticket`) // array of ticket objects // by defaul axios return promise with data key
             const transform = transformEventForModal(selectedRawEvent,response.data,false)
             setSelectedEvent(transform)

            //  console.log(`response: `,response)
            //  console.log('event:',selectedEvent)
            if(isMounted){
              setTickets(response.data)
              setIsLoadingTickets(false)
            }
             console.log(selectedRawEvent.event_id)
             console.log(response.data)
            //  setTickets(response.data)
            
            //  setTickets(response.data.data)
            //  console.log(tickets)

            }catch(error){
              console.error('Error while fetching ticket info: ',error)
            } finally {
              if(isMounted){setIsLoadingTickets(false);} // End loading state`}
              
            }
    }

      fetchData()
}
 
return () => {
  isMounted = false;
}




},[isModalOpen,selectedRawEvent])


  // ------------------------- HANDLE BOOKING

  const handleBooking = async (bookingData) => {
    const { fullName, phoneNumber, selectedTickets, allTickets, totalAmount } = bookingData;
    console.log("booking Data", allTickets)
  
    try {
      // Assuming you have a logged-in user session or user context
      // const userId = 123; // Get this from the logged-in user (e.g., from context or localStorage)

      console.log('All Tickets: ' , allTickets)
      const formattedData = Object.entries(selectedTickets).map(([ticketStrId,quantity]) => {
        const fullTicket = allTickets.find(ticket => ticket.ticket_id === Number(ticketStrId))
        console.log("Full ticket:", fullTicket)
        
        return {
          ticket_id : Number(ticketStrId),
          quantity,
          price: fullTicket?.price || 0,
          
        }
      })
      console.log("formatted Data: ",formattedData)


   
      
      
      // Send booking data to the backend
      const response = await axiosPrivate.post(`/api/events/${selectedEvent.event_id}/bookings`, {
        // user_id: userId, 
        // event_id: selectedEvent.event_id,
        full_name: fullName,
        phone_number: phoneNumber,
        tickets: formattedData,
        total_amount: totalAmount,
      });
  
      const {paymentData} = response.data.data
      console.log("Response data check in Event.jsx: " ,response.data.data)
      if (response.data.success) {
        return {
          success :true,
          paymentData
          // booking_id : response.data.bookingId
        }
    //     alert('Booking confirmed!');
    //     // onClose(); // Close the modal after successful booking
      } else {
        alert('Booking failed. Please try again.');
    }
    }
      
    catch (error) {
      console.error('Error while making the booking:', error);
      alert('Error while processing your booking. Please try again later.');
    }
  };
  

  





  const filteredEvents = events.filter(
    (event) =>
      
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue_location.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const startIndex = currentLot * eventsPerLot;
  const currentEvents = filteredEvents.slice(startIndex, startIndex + eventsPerLot);
  console.log(currentEvents)

  const handleNextLot = () => {
    if (currentLot < Math.ceil(filteredEvents.length / eventsPerLot) - 1) {
      setCurrentLot(currentLot + 1);
    }
  };

  const handlePrevLot = () => {
    if (currentLot > 0) {
      setCurrentLot(currentLot - 1);
    }
  };

  // Function to transform your event data to match modal expectations
  
  const transformEventForModal = (event,tickets, isLoadingTickets) => {

 

   
    return {
      event_id : event.event_id,
      name: event.title,
      description: event.description,
      // images: [{ src: Dragonsky, alt: event.title },{ src: Twilight, alt: event.title },{ src: Moon, alt: event.title },{ src: Cloud, alt: event.title }],
      images: event.images,
      startDate: event.start_datetime,
      endDate: event.end_datetime, // Adding 2 hours as example end time
      location: {
        address: event.venue_location,
        mapUrl: `https://maps.google.com/?q=${encodeURIComponent(event.venue_location)}`
      },
      tickets,
      isLoadingTickets,
      reviews: [
        {
          id: 1,
          name: 'John Doe',
          rating: 4,
          text: 'Great event! Had a wonderful time.'
        },
        {
          id: 2,
          name: 'Jane Smith',
          rating: 5,
          text: 'Absolutely loved it! Will come again.'
        }
      ]
    };
  };


  const showPrev = currentLot > 0;
  const showNext = currentLot < Math.ceil(filteredEvents.length / eventsPerLot) - 1;
  // const test = currentEvents.map(map => console.log(map.title))

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">All Events</h1>

        {/* Search Bar */}
        <div className="relative px-4 mb-8 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 r">
          <div className="absolute inset-y-0 right-10 flex items-center pl-3 pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          
          <input 
            type="text"
            placeholder="Search events by title or location..."
            className="w-full  py-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Event Cards */}
        <div className="relative">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl h-96 animate-pulse shadow-md" />
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="slider-container relative">
                {/* Left Arrow */}
                {showPrev && (
                  <button
                    onClick={handlePrevLot}
                    className="fixed top-1/2 left-4 transform -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 z-20"
                  >
                    <FaArrowLeft size={28} className="text-gray-700" />
                  </button>
                )}

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentEvents.map((event, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden animate-fadeIn"
                      style={{
                        animationDelay: `${parseInt(event.id) * 100}ms`,
                      }}
                    >
                    <div className="relative h-48 w-full">
                        {event.images?.length > 0 && (
                                <img
                              src={`${BASE_URL}/${event.images[0].image_url}`|| '/placeholder.svg'}
                              alt={event.title}
                            className="object-cover w-full h-full"
                          />
                          )}
                           {/* Heart Icon Button */}
      <button
        onClick={() => toggleFavorite(event.event_id)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 focus:outline-none"
      >
        {favoriteEvents.includes(event.event_id) ? (
          <FaHeart className="text-red-500" size={24} />
        ) : (
          <FaRegHeart className="text-emerald-400" size={24} />
        )}
      </button>
                          
                      </div>
                      

                      <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{event.title}</h2>
                        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{event.description}</p>

                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                          <FaCalendarAlt className="h-4 w-4" />
                          <span className="text-sm">{event.start_datetime}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500 mb-4">
                          <FaMapMarkerAlt className="h-4 w-4" />
                          <span className="text-sm">{event.venue_location}</span>
                        </div>

                      
                        
                         

                        <div className="flex gap-3">
                          <button 
                            onClick={() => {
                              setTickets([]);
                              setIsLoadingTickets(true);
                              setModalType('view')
                              setSelectedRawEvent(event)
                              // setSelectedEvent(transformEventForModal(event));
                              setIsModalOpen(true);
                            }}
                            className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-full transition-all"
                          >
                            View
                          </button>
                          <button className="flex-1 py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-full hover:translate-y-[-2px] transition-all"
                           onClick={() => {
                               setTickets([]);
                              setIsLoadingTickets(true);
                              setModalType('book')
                              setSelectedRawEvent(event)
                            // setSelectedEvent(transformEventForModal(event))
                            setIsModalOpen(true)
                            
                            }}
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Arrow */}
                {showNext && (
                  <button
                    onClick={handleNextLot}
                    className="fixed top-1/2 right-4 transform -translate-y-1/2 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 z-20"
                  >
                    <FaArrowRight size={28} className="text-gray-700" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Modal */}
      {isModalOpen && selectedEvent && modalType === 'view' && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          openModal = {() => setIsModalOpen(true)}
          event={selectedEvent}
          modalType = {() => setModalType('book')}
        />
      )}

      {isModalOpen && selectedEvent && modalType === 'book' && (
        <Booking
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
          onSubmit={handleBooking}
        />
      )}
    </div>
  );
}

