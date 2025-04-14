// src/pages/HomePage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import opImg from '../images/one-piece.png'
import Footer from '../components/Footer';


const Home = () => {
  // Sample events data - replace with your actual data
  const [writerEffect,setWriterEffect] = useState()
  const featuredEvents = [
    {
      id: 1,
      title: "Tech Conference 2023",
      date: "Oct 15, 2023",
      location: "San Francisco, CA",
      price: "$99",
      category: "Technology"
    },
    {
      id: 2,
      title: "Music Festival",
      date: "Nov 5, 2023",
      location: "Austin, TX",
      price: "$75",
      category: "Music"
    },
    {
      id: 3,
      title: "Food & Wine Expo",
      date: "Dec 10, 2023",
      location: "New York, NY",
      price: "$45",
      category: "Food"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Event Organizer",
      quote: "EventFlow has transformed how I manage my events. The platform is intuitive and the templates save me hours of work!",
      rating: "★★★★★"
    },
    {
      name: "Michael Chen",
      role: "Conference Attendee",
      quote: "I love how easy it is to find and register for events. The ticket management system is seamless and user-friendly.",
      rating: "★★★★★"
    },
    {
      name: "Jessica Williams",
      role: "Corporate Event Planner",
      quote: "The analytics and reporting features have been invaluable for our corporate events. Highly recommend for any event professional.",
      rating: "★★★★★"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
              <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-black sm:text-5xl md:text-6xl">
                    <span className="block">Discover & Create</span>
                    <span className="block text-indigo-400">Amazing Events</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Your all-in-one platform for finding, managing, and creating memorable events. Join us today!
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link
                        to="/events"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black  hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                      >
                       <span className='text-black'>Find Events</span> 
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link
                        to="/create-event"
                        className="w-full flex items-center justify-center px-8 py-3 border border-white text-base font-medium rounded-md  bg-indigo-600 hover:bg-indigo-800 md:py-4 md:text-lg md:px-10"
                      >
                        <span className='text-white'>Create Event</span>
                      </Link>
                    </div>
                  </div>
                  <div className="mt-8 max-w-md mx-auto sm:mx-0">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search events..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src={opImg}
            alt="People enjoying an event"
          />
        </div>
      </div>

      {/* Featured Events */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Featured Events
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Discover the most exciting events happening around you
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                    <div className="mt-2 flex items-center text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {event.date}
                    </div>
                    <div className="mt-2 flex items-center text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">{event.price}</span>
                      <Link
                        to={`/events/${event.id}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/events"
              className="text-indigo-600 hover:text-indigo-800 font-medium rounded-md  underline"
            >
              View All Events
            </Link>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Hear from event organizers and attendees who love our platform
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                  <p className="text-gray-600">{testimonial.quote}</p>
                  <div className="mt-3 text-yellow-400">{testimonial.rating}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

     
   
    </div>
    ); 
  
};

export default Home;