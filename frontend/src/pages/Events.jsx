import Dragonsky from '../images/Dragon Sky.jpg';
import Twilight from '../images/Twilight.png';
import Moon from '../images/Moon.png';
import Cloud from '../images/Cloud.png';
import axios from  'axios'
import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { FaRupeeSign as RupeeIcon } from 'react-icons/fa6';
import { EventModal } from '../components/EventModal'; // Add this import

export default function Events() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentLot, setCurrentLot] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const eventsPerLot = 8;

  // useEffect(() => {
  //   const loadEvents = async () => {
  //     setIsLoading(true);
  //     setTimeout(() => {
  //       setEvents(sampleEvents);
  //       setIsLoading(false);
  //     }, 800);
  //   };
  //   loadEvents();
  // }, []);

  useEffect(() => {

    const event = axios.get('')

  },[])




  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const startIndex = currentLot * eventsPerLot;
  const currentEvents = filteredEvents.slice(startIndex, startIndex + eventsPerLot);

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
  const transformEventForModal = (event) => {
    return {
      name: event.title,
      description: event.description,
      images: [{ src: Dragonsky, alt: event.title },{ src: Twilight, alt: event.title },{ src: Moon, alt: event.title },{ src: Cloud, alt: event.title }],
      startDate: event.date,
      endDate: new Date(event.date.getTime() + 2 * 60 * 60 * 1000), // Adding 2 hours as example end time
      location: {
        address: event.location,
        mapUrl: `https://maps.google.com/?q=${encodeURIComponent(event.location)}`
      },
      ticketType: event.priceFrom === 0 ? 'Free' : 'General Admission',
      ticketsAvailable: 100, // Static value since your sample doesn't have this
      price: event.priceFrom,
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">All Events</h1>

        {/* Search Bar */}
        <div className="relative px-4 mb-8 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 r">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search events by title or location..."
            className="w-full py-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                        <img
                          src={ Dragonsky || '/placeholder.svg'}
                          alt={event.title}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{event.title}</h2>
                        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{event.description}</p>

                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                          <FaCalendarAlt className="h-4 w-4" />
                          <span className="text-sm">{formatDate(event.date)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500 mb-4">
                          <FaMapMarkerAlt className="h-4 w-4" />
                          <span className="text-sm">{event.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500 mb-6">
                          <span className="text-sm font-medium">
                            {event.priceFrom === 0 ? 'Free Entry' : `From Rs ${event.priceFrom.toFixed(2)}`}
                          </span>
                        </div>

                        <div className="flex gap-3">
                          <button 
                            onClick={() => {
                              setSelectedEvent(transformEventForModal(event));
                              setIsModalOpen(true);
                            }}
                            className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-full transition-all"
                          >
                            View
                          </button>
                          <button className="flex-1 py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-full hover:translate-y-[-2px] transition-all">
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
      {isModalOpen && selectedEvent && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
        />
      )}
    </div>
  );
}

// Sample Event Data (keep this unchanged)
const sampleEvents = [
  { id: 1, title: 'Music Festival', description: 'A grand music festival with famous bands and artists.', date: new Date(), location: 'City Park', priceFrom: 200 },
  { id: 2, title: 'Art Exhibition', description: 'A collection of modern art by renowned artists.', date: new Date(), location: 'Art Gallery', priceFrom: 50 },
  // ... rest of your sample events data
];