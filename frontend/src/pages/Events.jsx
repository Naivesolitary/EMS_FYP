import eventBanner from '../images/Dragon Sky.jpg';
import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { FaRupeeSign as RupeeIcon } from 'react-icons/fa6';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentLot, setCurrentLot] = useState(0);
  const eventsPerLot = 8;

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setEvents(sampleEvents);
        setIsLoading(false);
      }, 800);
    };
    loadEvents();
  }, []);

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

  const showPrev = currentLot > 0;
  const showNext = currentLot < Math.ceil(filteredEvents.length / eventsPerLot) - 1;

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">All Events</h1>

        {/* Search Bar */}
        <div className="relative mb-8 w-full md:w-3/4 lg:w-2/3 xl:w-1/2">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search events by title or location..."
            className="w-full py-2 pl-10 pr-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                          src={eventBanner || '/placeholder.svg'}
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
                          <button className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-full transition-all">
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
    </div>
  );
}

// Sample Event Data
const sampleEvents = [
  { id: 1, title: 'Music Festival', description: 'A grand music festival with famous bands and artists.', date: new Date(), location: 'City Park', priceFrom: 200 },
  { id: 2, title: 'Art Exhibition', description: 'A collection of modern art by renowned artists.', date: new Date(), location: 'Art Gallery', priceFrom: 50 },
  { id: 3, title: 'Food Truck Festival', description: 'The best food trucks come together for a delicious event.', date: new Date(), location: 'Downtown', priceFrom: 100 },
  { id: 4, title: 'Tech Conference', description: 'A conference on the latest tech trends and innovations.', date: new Date(), location: 'Tech Hub', priceFrom: 150 },
  { id: 5, title: 'Charity Run', description: 'A run to raise money for a great cause.', date: new Date(), location: 'Central Park', priceFrom: 0 },
  { id: 6, title: 'Comedy Night', description: 'Laugh the night away with our hilarious comedians.', date: new Date(), location: 'Comedy Club', priceFrom: 250 },
  { id: 7, title: 'Yoga Retreat', description: 'A peaceful retreat to relax and rejuvenate.', date: new Date(), location: 'Mountain Resort', priceFrom: 1000 },
  { id: 8, title: 'Book Launch', description: 'A new book launch by an acclaimed author.', date: new Date(), location: 'City Library', priceFrom: 50 },
  { id: 9, title: 'Dance Competition', description: 'A thrilling dance competition with contestants from all over the world.', date: new Date(), location: 'Arena', priceFrom: 150 },
  { id: 10, title: 'Fashion Show', description: 'A glamorous fashion show featuring top designers.', date: new Date(), location: 'Fashion Hub', priceFrom: 300 },
  { id: 11, title: 'Cooking Class', description: 'Learn to cook with a famous chef in this hands-on class.', date: new Date(), location: 'Culinary School', priceFrom: 200 },
  { id: 12, title: 'Startup Pitch Event', description: 'An event for entrepreneurs to pitch their startups.', date: new Date(), location: 'Innovation Center', priceFrom: 150 },
  { id: 13, title: 'Sculpture Exhibition', description: 'A stunning exhibition of modern sculptures.', date: new Date(), location: 'Museum of Arts', priceFrom: 100 },
  { id: 14, title: 'DJ Party', description: 'A night of electrifying music with top DJs.', date: new Date(), location: 'Nightclub', priceFrom: 500 },
  { id: 15, title: 'Photography Workshop', description: 'A workshop to improve your photography skills.', date: new Date(), location: 'Photo Studio', priceFrom: 250 },
  { id: 16, title: 'Stand-up Comedy Show', description: 'An evening of jokes and laughs from some of the best stand-up comedians.', date: new Date(), location: 'Comedy Club', priceFrom: 150 },
  { id: 17, title: 'Pottery Class', description: 'A creative pottery-making class for all skill levels.', date: new Date(), location: 'Craft Studio', priceFrom: 100 },
  { id: 18, title: 'Science Fair', description: 'A fun science fair for kids and families.', date: new Date(), location: 'Community Center', priceFrom: 50 },
  { id: 19, title: 'Fitness Bootcamp', description: 'A challenging fitness bootcamp to get in shape.', date: new Date(), location: 'Fitness Gym', priceFrom: 300 },
  { id: 20, title: 'Wedding Expo', description: 'Everything you need for planning your wedding, all in one place.', date: new Date(), location: 'Expo Hall', priceFrom: 50 },
];
