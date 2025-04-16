import eventBanner from '../images/Dragon Sky.jpg';
import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { FaRupeeSign as RupeeIcon } from 'react-icons/fa6';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
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
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl h-96 animate-pulse shadow-md" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
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
        )}
      </div>
    </div>
  );
}

// Sample data
const sampleEvents = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description:
      'Join us for a weekend of amazing live performances from top artists across multiple genres. Food, drinks, and good vibes included!',
    date: new Date('2025-07-15T18:00:00'),
    location: 'Central Park, New York',
    priceFrom: 49.99,
  },
  {
    id: '2',
    title: 'Tech Conference 2025',
    description:
      'The biggest tech conference of the year featuring keynotes from industry leaders, workshops, and networking opportunities.',
    date: new Date('2025-05-22T09:00:00'),
    location: 'Convention Center, San Francisco',
    priceFrom: 199.99,
  },
  {
    id: '3',
    title: 'Food & Wine Festival',
    description: 'Taste exquisite dishes and fine wines from renowned chefs and wineries from around the world.',
    date: new Date('2025-06-10T12:00:00'),
    location: 'Waterfront Park, Chicago',
    priceFrom: 75.0,
  },
  {
    id: '4',
    title: 'International Film Festival',
    description:
      'Showcasing independent films from emerging directors and established filmmakers from across the globe.',
    date: new Date('2025-08-05T19:30:00'),
    location: 'Grand Theater, Los Angeles',
    priceFrom: 25.0,
  },
  {
    id: '5',
    title: 'Wellness Retreat Weekend',
    description: 'Rejuvenate your mind and body with yoga sessions, meditation workshops, and healthy living seminars.',
    date: new Date('2025-09-18T08:00:00'),
    location: 'Mountain Resort, Colorado',
    priceFrom: 299.99,
  },
  {
    id: '6',
    title: 'Startup Pitch Competition',
    description: 'Watch innovative startups pitch their ideas to investors and compete for funding opportunities.',
    date: new Date('2025-04-12T10:00:00'),
    location: 'Innovation Hub, Austin',
    priceFrom: 0,
  },
  {
    id: '7',
    title: 'Comic Book Convention',
    description: 'Meet your favorite comic book artists, cosplayers, and fellow fans at this exciting convention.',
    date: new Date('2025-10-25T11:00:00'),
    location: 'Exhibition Center, Seattle',
    priceFrom: 35.0,
  },
  {
    id: '8',
    title: 'Charity Gala Dinner',
    description:
      "An elegant evening of fine dining and entertainment to raise funds for children's education programs.",
    date: new Date('2025-11-30T19:00:00'),
    location: 'Grand Ballroom, Miami',
    priceFrom: 150.0,
  },
];
