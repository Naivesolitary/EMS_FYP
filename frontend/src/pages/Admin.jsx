import { useState,useEffect,useMemo} from "react"
import Sidebar from "../components/Sidebar"
import { BASE_URL } from "../config"
// import Topbar from "../components/Topbar"
import StatCard from "../components/StatCard"
import ChartComponent from "../components/ChartComponent"
import TableComponent from "../components/TableComponent"
import FilterComponent from "../components/FilterComponent"
import PaginationComponent from "../components/PaginationComponent"
import { FaCalendarAlt, FaUserCheck, FaUserClock, FaTicketAlt } from "react-icons/fa"
import userAxiosPrivate from "../hooks/useAxiosPrivate"



const Admin = () => {
  const axiosPrivate = userAxiosPrivate()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [events, setEvents] = useState([])
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [venues, setVenues] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [toggleAddVenue,setToggleAddVenue] = useState(false)
  const [bookings, setBooking] = useState([])
  const [attendees, setAttendees] = useState([])
  const [newVenue, setNewVenue] = useState({
    name: "",
    address: "",
    country: "Nepal", 
    postal_code: "",
    capacity: "",
    contact_phone: "",
    contact_email: ""
  });
  const [currentVenue,setCurrentVenue] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    organizerName: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5


  console.log("CurrentEvent: ",currentEvent)
  console.log('Current Venue: ', currentVenue)
  console.log('Organizers: ', organizers)


  ///  FETCH EVENTS INFO 
  useEffect(() => {
     const fetchEventInfo = async() => {
      try{
      const response = await axiosPrivate.get('/api/dashboard/events',{withCredentials:true})
      const eventList = response.data.data
      const formattedEvents = eventList.map(event => ({
        id:event.event_id,
        name:event.title,
        date: new Date(event.start_datetime).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}),
        organizer: event.name,
        status:event.status,
        imageurl:event.image_url

      }))
      console.log("Events: ", formattedEvents)
      setEvents(formattedEvents)
    }catch(err){
      console.error("Failed to fetch events:", err)
    }

  }
  fetchEventInfo();
  },[])


  
// date: "2024-03-15",
   ///  FETCH Booking INFO 
   useEffect(() => {
    const fetchBookingInfo = async() => {
     try{
     const response = await axiosPrivate.get('/api/dashboard/booking',{withCredentials:true})
     const bookingList = response.data.data
     const formattedBookingInfo = bookingList.map(booking => ({
       id:booking.booking_id,
       eventName:booking.title,
       bookedBy : booking.name_at_booking,
       status:booking.status,
       
       date: new Date(booking.booking_date).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}),
     

     }))
     console.log("Bookings: ", formattedBookingInfo)
     setBooking(formattedBookingInfo)
   }catch(err){
     console.error("Failed to fetch events:", err) 
   }

 }
 fetchBookingInfo();
 },[])

 
 {


  /// FETCH Attendde INFO:
  useEffect(() => {
    const fetchAttendeeInfo = async() => {
     try{
     const response = await axiosPrivate.get('/api/dashboard/attendees',{withCredentials:true})
     const attendeesList = response.data.data
     const formattedAttendeeInfo = attendeesList.map(attendee => ({
       booking_id : attendee.booking_id,
       id:attendee.user_id,
       name:attendee.name_at_booking,
       email : attendee.email,
       event :  attendee.title,
       status : attendee.status
       
     

     }))
     console.log("Attendees: ", formattedAttendeeInfo)
     setAttendees(formattedAttendeeInfo)
   }catch(err){
     console.error("Failed to fetch attendees info:", err)
   }

 }
  fetchAttendeeInfo();
 },[])


///  FETCH VENUE INFO 
useEffect(() => {
  const fetchVenues = async () => {
    try {
      const response = await axiosPrivate.get('/api/dashboard/venues');
      console.log("RESPONSE OF VENUES: ",   response)
      setVenues(response.data.data);
    } catch (err) {
      console.error("Failed to fetch venues:", err);
    }
  };
  fetchVenues();
}, []);



// {
//   id: 4,
//   name: "Hope Foundation",
//   documents: ["nonprofit_certificate.pdf", "id_verification.pdf"],
//   status: "Verified",
// },

useEffect(() => {
  const fetchOrganizerInfo = async () => {
    try {
      const response = await axiosPrivate.get('/api/dashboard/organizers');
      console.log("RESPONSE OF Organizer info: ",   response)
      setOrganizers(response.data.data);
    } catch (err) {
      console.error("Failed to fetch organizers:", err);
    }
  };
  fetchOrganizerInfo();

},[])
  /// EVENTS FILTER SECTIONS: 

  const handleFilterChange = (name, value) => {
    console.log('Filter change:', name, value);
    console.log('Current filters before update:', filters);
    
    setFilters(prev => {
      const newFilters = { ...prev, [name]: value };
      console.log('Filters after update:', newFilters);
      return newFilters;
    });
  };
  const filteredEvents = events.filter(event => {
    // Filter by search term (event name or organizer)
    const matchesSearch = searchTerm === "" || 
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by status
    const matchesStatus = filters.status === "" || 
      event.status.toLowerCase() === filters.status.toLowerCase();

    // Filter by organizer name
    const matchesOrganizer = filters.organizerName === "" || 
      event.organizer.toLowerCase().includes(filters.organizerName.toLowerCase());

    // Filter by date range (convert string dates to Date objects for comparison)
    let matchesDate = true;
    if (filters.startDate || filters.endDate) {
      const eventDate = new Date(event.date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
      
      if (startDate && eventDate < startDate) {
        matchesDate = false;
      }
      if (endDate && eventDate > endDate) {
        matchesDate = false;
      }
    }

    return matchesSearch && matchesStatus && matchesOrganizer && matchesDate;
  });
  

  const handleEditClick = (event) => {
    setCurrentEvent(event);
    setIsEditModalOpen(true);
  };

  const handleVenueEditClick = (venue) => {
    setCurrentVenue(venue);
    setIsEditModalOpen(true)
  }
  
  
  const handleSaveEvent = async () => {
    try {
      // Update in backend
     const response = await axiosPrivate.put(`/api/dashboard/events/${currentEvent.id}`, currentEvent);
     console.log("PUT RESPONSE: ",response.data)
      
      // Update in state
      setEvents(events.map(event => 
        event.id === currentEvent.id ? currentEvent : event
      ));
      
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update event:", err);
    }
  };


  // ************************** DELETE Event *************
  const handleDeleteEvent = async (event) => {
    const {id} = event
    
      try {
        await axiosPrivate.delete(`/api/dashboard/events/${id}`);
        setEvents(events.filter(event => event.id !== id));
        // Show success message
        alert("Event deleted successfully");
      } catch (err) {
        console.error("Failed to delete event:", err);
        alert("Failed to delete event");
      }
    
  };


  // ********************* DELETE Booking *******************
  const handleDeleteBooking = async (booking) => {
     const {id} = booking

    
    try {
      await axiosPrivate.delete(`/api/dashboard/booking/${id}`);
      setBooking(bookings.filter(booking => booking.id !== id));
      // setIsStatusModalOpen(false);
      // Show success message
      alert("Booking deleted successfully");
    } catch (err) {
      console.error("Failed to delete Booking:", err);
      // alert("Failed to delete Booking");
    }
  
};

 // ********************* DELETE Attendee *******************
 const handleDeleteAttendee= async (attendee) => {
  const { id, booking_id } = attendee; 
  try {
    await axiosPrivate.delete(`/api/dashboard/attendee/${id}/${booking_id}`,{data:{booking_id:attendee.bookingId}});
    setAttendees(attendees.filter((attendee) => attendee.booking_id !== booking_id));
    // setIsStatusModalOpen(false);
    // Show success message
    alert("Attendee deleted successfully");
  } catch (err) {
    console.error("Failed to delete Attendee:", err);
    
  }

};


const handleVerifApprove = async(organizer) => {
  const {verification_id} = organizer
  try{
  await axiosPrivate.put(`/api/dashboard/organizers/${verification_id}`,{verification_status:"verified"},{withCredentials:true})
  setOrganizers(prevOrganizers =>
    prevOrganizers.map(org =>
      org.verification_id === verification_id
        ? { ...org, verification_status: "verified" }
        : org
    )
  );}
  catch(err){
    console.error("Failed to verify organizer:", error);
    alert("Failed to verify organizer. Please try again.");
    
  }
  

    
}

const handleVerifReject = async (organizer) => {
  const { verification_id } = organizer;
  try {
    await axiosPrivate.put(
      `/api/dashboard/organizers/${verification_id}`,
      { verification_status: "rejected" },
      { withCredentials: true }
    );

    // Update local state
    setOrganizers(prevOrganizers =>
      prevOrganizers.map(org =>
        org.verification_id === verification_id
          ? { ...org, verification_status: "rejected" }
          : org
      )
    );

  } catch (error) {
    console.error("Failed to reject organizer:", error);
    alert("Failed to reject organizer. Please try again.");
  }
};
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent(prev => ({ ...prev, [name]: value }));
  };



  const handleVenueEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentVenue(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Mock data for the dashboard
  const stats = [
    { id: 1, title: "Total Events", value: 124, icon: <FaCalendarAlt />, color: "bg-blue-100 text-blue-500" },
    { id: 2, title: "Total Bookings", value: 1458, icon: <FaTicketAlt />, color: "bg-green-100 text-green-500" },
    { id: 3, title: "Verified Organizers", value: 48, icon: <FaUserCheck />, color: "bg-purple-100 text-purple-500" },
    { id: 4, title: "Pending Verifications", value: 12, icon: <FaUserClock />, color: "bg-yellow-100 text-yellow-500" },
  ]


  // Mock data for organizers
  // const organizers = [
  //   { id: 1, name: "TechCorp Inc.", documents: ["business_license.pdf", "id_verification.pdf"], status: "Verified" },
  //   { id: 2, name: "Melody Events", documents: ["business_license.pdf", "tax_certificate.pdf"], status: "Verified" },
  //   { id: 3, name: "Business Network", documents: ["business_license.pdf"], status: "Pending" },
  //   {
  //     id: 4,
  //     name: "Hope Foundation",
  //     documents: ["nonprofit_certificate.pdf", "id_verification.pdf"],
  //     status: "Verified",
  //   },
  //   { id: 5, name: "Creative Arts", documents: ["business_license.pdf", "portfolio.pdf"], status: "Pending" },
  //   {
  //     id: 6,
  //     name: "New Events Co.",
  //     documents: ["business_application.pdf", "id_verification.pdf"],
  //     status: "Pending",
  //   },
  //   {
  //     id: 7,
  //     name: "Global Conferences",
  //     documents: ["business_license.pdf", "insurance_cert.pdf"],
  //     status: "Rejected",
  //   },
  // ]

 

  // Chart data for monthly events
  const monthlyEventsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Events Created",
        data: [8, 12, 15, 10, 14, 18, 22, 17, 13, 11, 9, 16],
        backgroundColor: "rgba(99, 179, 237, 0.6)",
        borderColor: "rgba(99, 179, 237, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Chart data for booking status distribution
  const bookingStatusData = {
    labels: ["Confirmed", "Pending", "Cancelled"],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ["rgba(72, 187, 120, 0.7)", "rgba(237, 137, 54, 0.7)", "rgba(229, 62, 62, 0.7)"],
        borderColor: ["rgba(72, 187, 120, 1)", "rgba(237, 137, 54, 1)", "rgba(229, 62, 62, 1)"],
        borderWidth: 1,
      },
    ],
  }


  // ########################## FILTER BOOKINGS #########################
  const filteredBookings = bookings
  .filter(booking => {
    // Search by event name or booked by
    const matchesSearch = searchTerm === "" || 
      (booking.eventName && booking.eventName.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (booking.bookedBy && booking.bookedBy.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by status
    const matchesStatus = !filters.status || 
    (booking.status && booking.status.toLowerCase() === filters.status.toLowerCase());
    
    // Filter by date range
    let matchesDate = true;
  if (filters.startDate || filters.endDate) {
    try {
      const bookingDate = new Date(booking.date);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
      
      if (startDate && bookingDate < startDate) matchesDate = false;
      if (endDate && bookingDate > endDate) matchesDate = false;
    } catch (e) {
      console.error("Date parsing error:", e);
      matchesDate = false;
    }
  }
  
  return matchesSearch && matchesStatus && matchesDate;

  });


  const filteredOrganizers = organizers.filter(organizer => {
    // Search by organizer name
    const matchesSearch = searchTerm === "" || 
      (organizer.name && organizer.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by verification status
    const matchesStatus = !filters.status || 
      (organizer.verification_status && organizer.verification_status.toLowerCase() === filters.status.toLowerCase());
    
    return matchesSearch && matchesStatus;
  });
  


  // ################################ FILTER ATTENDEES #################################
  const filteredAttendees = attendees.filter(attendee => {
    // Search by attendee name, email, or event
    const matchesSearch = searchTerm === "" || 
      (attendee.name && attendee.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (attendee.email && attendee.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (attendee.event && attendee.event.toLowerCase().includes(searchTerm.toLowerCase()));
  
    // Filter by status
    const matchesStatus = !filters.status || 
      (attendee.status && attendee.status.toLowerCase() === filters.status.toLowerCase());
  
    return matchesSearch && matchesStatus;
  });
  

 

// Handlers for status change
const handleStatusChange = (e) => {
  setCurrentBooking(prev => ({ ...prev, status: e.target.value }));
};

const handleSaveStatus = async () => {
  try {
    await axiosPrivate.put(`/api/bookings/${currentBooking.id}`, {
      status: currentBooking.status
    });
    setBooking(bookings.map(booking => 
      booking.id === currentBooking.id ? currentBooking : booking
    ));
    setIsStatusModalOpen(false);
  } catch (err) {
    console.error("Failed to update booking status:", err);
  }
};

  // Handle search
  const handleSearch = (term) => {
    console.log("search: ", term)
    setSearchTerm(term)
    setCurrentPage(1) // Reset to first page when searching
  }

  

  // const filteredVenues = venues.filter(venue => {
  //   console.log("Current search term:", searchTerm);
  //   console.log("Venue being checked:", venue.name, venue.address);
    
  //   const matches = searchTerm === "" || 
  //     venue.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
  //     venue.address.toLowerCase().includes(searchTerm.toLowerCase());
    
  //   console.log(`Does venue match? ${matches}`);
  //   return matches;
  // });

  const filteredVenues = useMemo(() => {
    if (!searchTerm) return venues;
    
    return venues.filter(venue => {
      const searchLower = searchTerm.toLowerCase();
      return (
        venue.name.toLowerCase().includes(searchLower) ||
        venue.address.toLowerCase().includes(searchLower) ||
        (venue.country && venue.country.toLowerCase().includes(searchLower)) ||
        (venue.contact_email && venue.contact_email.toLowerCase().includes(searchLower))
      );
    });
  }, [venues, searchTerm]);

  console.log("Filtered Venues: ", filteredVenues)
  
  // Handle pagination
  const handlePageChange = (pageNumber) => {
    console.log("Changing to page:", pageNumber);
    console.log("Current page: ",currentPage) // Debug log
    setCurrentPage(pageNumber);
  };



  // Handle venue form input changes
  const handleVenueInputChange = (e) => {
    const { name, value } = e.target
    setNewVenue({
      ...newVenue,
      [name]: value,
    })
  }

  // *********************  ADD NEW VENUE **********************************
  const handleVenueSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convert capacity to number
      const venueToSubmit = {
        ...newVenue,
        capacity: parseInt(newVenue.capacity)
      };
  
       console.log("venue to Submit ", venueToSubmit)
      const response = await axiosPrivate.post('/api/dashboard/venues', venueToSubmit);
      
      // Add the new venue to state
      setVenues(prev => [...prev, response.data.data]);
      
      // Reset form
      setNewVenue({
        name: "",
        address: "",
        country: "Nepal",
        postal_code: "",
        capacity: "",
        contact_phone: "",
        contact_email: ""
      });
      
      alert("Venue added successfully!");
    } catch (err) {
      console.error("Failed to add venue:", err);
      alert("Failed to add venue");
    }
  };

 

  const handleSaveVenue = async () => {
    try {
      const response = await axiosPrivate.put(
        `/api/dashboard/venues/${currentVenue.venue_id}`,
        currentVenue
      );
      
      // Update the venues list
      setVenues(venues.map(v => 
        v.venue_id === currentVenue.venue_id ? currentVenue : v
      ));
      
      setIsEditModalOpen(false);
      alert("Venue updated successfully!");
    } catch (err) {
      console.error("Failed to update venue:", err);
      alert("Failed to update venue");
    }
  };
  // Render the appropriate section based on activeSection
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <StatCard key={stat.id} title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} />
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Events Created Per Month</h3>
                <ChartComponent type="bar" data={monthlyEventsData} />
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Booking Status Distribution</h3>
                <ChartComponent type="pie" data={bookingStatusData} />
              </div>
            </div>
          </div>
        )

      case "events":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Event Management</h2>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
              <FilterComponent
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                filters={[
                  { name: "status", label: "Status", type: "select", options: ["", "Upcoming", "Completed", "Draft"] },
                  { name: "startDate", label: "Start Date", type: "date" },
                  { name: "endDate", label: "End Date", type: "date" },
                  { name: "organizerName", label: "Organizer", type: "text" },
                ]}
              />
            </div>

            {/* Events Table */}
            <TableComponent
        columns={[
          { 
            key: "image", 
            label: "", 
            render: (item) => (
              item.imageurl && (
                <img 
                  src={`${BASE_URL}/${item.imageurl}`} 
                  alt="Event" 
                  className="h-10 w-10 rounded object-cover"
                />
               
              )
            )
          },
          { key: "name", label: "Event Name" },
          { key: "date", label: "Event Date" },
          { key: "organizer", label: "Organizer Name" },
          { key: "status", label: "Status" },
          { key: "actions", label: "Actions" },
        ]}
        data={filteredEvents}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        actionButtons={["edit", "delete"]}
        onEditClick={handleEditClick} // Pass the edit handler
        onDeleteClick={handleDeleteEvent}
      />

            {/* Pagination */}
            <PaginationComponent
              totalItems={filteredEvents.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
            {isEditModalOpen && currentEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Event</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentEvent.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                <input
                  type="date"
                  name="date"
                  value={new Date(currentEvent.date).toISOString().split('T')[0]}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setCurrentEvent(prev => ({
                      ...prev,
                      date: newDate.toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})
                    }));
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
                <input
                  type="text"
                  name="organizer"
                  value={currentEvent.organizer}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={currentEvent.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                  <option value="Draft">Draft</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              {currentEvent.imageurl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
                  <img 
                    src={`${BASE_URL}/${currentEvent.imageurl}`} 
                    alt="Event" 
                    className="h-40 w-40 object-contain rounded"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
         
          </div>
        )

      case "organizers":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Organizer Verification</h2>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
              <FilterComponent
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                filters={[
                  { name: "status", label: "Verification Status", type: "select", options: ["", "Pending", "Verified", "Rejected"] },
                ]}
              />
            </div>

            {/* Organizers Table */}
            <TableComponent
              columns={[
                { key: "name", label: "Organizer Name" },
                { key: "verification_notes", label: "Uploaded Documents" },
                { key: "verification_status", label: "Status" },
                { key: "actions", label: "Actions" },
              ]}
              data={filteredOrganizers}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              actionButtons={["approve", "reject"]}
              onApprove={handleVerifApprove}
              onReject={handleVerifReject}
            />

            {/* Pagination */}
            <PaginationComponent
              totalItems={filteredOrganizers.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )

      case "bookings":  /// CHECKED
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Booking Management</h2>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
              <FilterComponent
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                filters={[
                  {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: ["", "Confirmed", "Pending", "Cancelled"],
                  },
                  { name: "startDate", label: "Start Date", type: "date" },
                  { name: "endDate", label: "End Date", type: "date" },
                ]}
              />
            </div>

            {/* Bookings Table */}
            <TableComponent
              columns={[
                { key: "id", label: "Booking ID" },
                { key: "eventName", label: "Event Name" },
                { key: "bookedBy", label: "Booked By" },
                {
                  key: "date", 
                  label: "Booking Date",
                  render: (item) => new Date(item.date).toLocaleDateString()

                },
                { key: "status", label: "Status" },
                { key: "actions", label: "Actions"} ,
               
              ]}
              data={filteredBookings}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              actionButtons={[ "edit", "delete"]}
              onEditClick={(item) => {
              setCurrentBooking(item);
              setIsStatusModalOpen(true);}}
              onDeleteClick ={handleDeleteBooking}
  
  
  // Add other handlers if needed:
  
            />
            {/* Status Edit Modal */}
      {isStatusModalOpen && currentBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
            <h3 className="text-lg font-medium mb-4">Update Booking Status</h3>
            <select
              value={currentBooking.status}
              onChange={handleStatusChange}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

            {/* Pagination */}
            <PaginationComponent
              totalItems={filteredBookings.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )

      case "attendees":  /// CHECKED
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Attendee Management</h2>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow">
              <FilterComponent
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                filters={[
                  {
                    name: "status",
                    label: "Status",
                    type: "select",
                    options: ["", "Confirmed", "Pending", "Cancelled"],
                  },
                ]}
              />
            </div>

            {/* Attendees Table */}
            <TableComponent
              columns={[
                { key: "name", label: "Attendee Name" },
                { key: "email", label: "Email" },
                { key: "event", label: "Event Attending" },
                { key: "status", label: "Booking Status" },
                { key: "actions", label: "Actions" },
              ]}
              data={filteredAttendees}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              actionButtons={[ "delete"]}
              onDeleteClick={handleDeleteAttendee}
            />

            {/* Pagination */}
            <PaginationComponent
              totalItems={filteredAttendees.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )

      case "venues":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Venue Management</h2>
            <button onClick={() => setToggleAddVenue(!toggleAddVenue)} className="text-lg font-medium bg-emerald-400 rounded p-0.5 text-gray-800 mb-4 cursor-pointer">Add New Venue</button>
            {/* Add New Venue Form */}
            <div className={`bg-white p-6 rounded-lg shadow ${!toggleAddVenue ? "hidden" : "" }`}>
  
  <form onSubmit={handleVenueSubmit} className={`grid grid-cols-1 md:grid-cols-2 gap-4 `}>
    {/* Venue Name */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
      <input
        type="text"
        name="name"
        value={newVenue.name}
        onChange={handleVenueInputChange}
        className="w-full px-3 py-2 border rounded-md"
        required
      />
    </div>
    
    {/* Address */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
      <input
        type="text"
        name="address"
        value={newVenue.address}
        onChange={handleVenueInputChange}
        className="w-full px-3 py-2 border rounded-md"
        required
      />
    </div>
    
    {/* Country */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
      <select
        name="country"
        value={newVenue.country}
        onChange={handleVenueInputChange}
        className="w-full px-3 py-2 border rounded-md"
      >
        <option value="Nepal">Nepal</option>
        <option value="India">India</option>
        <option value="Other">Other</option>
      </select>
    </div>
    
    {/* Postal Code */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
      <input
        type="text"
        name="postal_code"
        value={newVenue.postal_code}
        onChange={handleVenueInputChange}
        className="w-full px-3 py-2 border rounded-md"
      />
    </div>
    
    {/* Capacity */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
      <input
        type="number"
        name="capacity"
        value={newVenue.capacity}
        onChange={handleVenueInputChange}
        className="w-full px-3 py-2 border rounded-md"
        required
        min="1"
      />
    </div>
    
    {/* Contact Phone */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
      <input
        type="tel"
        name="contact_phone"
        value={newVenue.contact_phone}
        onChange={handleVenueInputChange}
        className="w-full px-3 py-2 border rounded-md"
      />
    </div>
    
    {/* Contact Email */}
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
      <input
        type="email"
        name="contact_email"
        value={newVenue.contact_email}
        onChange={handleVenueInputChange}
        className="w-full px-3 py-2 border rounded-md"
      />
    </div>
    
    <div className="md:col-span-2">
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add Venue
      </button>
    </div>
  </form>
</div>

            {/* Venues Table */}
            <div className="bg-white p-4 rounded-lg shadow">
              <FilterComponent onSearch={handleSearch} placeholder="Search venues..." />

              <TableComponent
                columns={[
      // { key: "venue_id", label: "Venue ID" },
    { key: "name", label: "Venue Name" },
    {key:"postal_code", label:"Postal Code"},
    { 
      key: "address", 
      label: "Address",
      render: (item) => `${item.address}, ${item.country} (${item.postal_code})`
    },
    { key: "capacity", label: "Capacity" },
    { key: "contact_phone", label: "Contact Phone" },
  { key: "contact_email", label: "Contact Email" },,
    { key: "actions", label: "Actions" },
  ]}
                data={filteredVenues}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                actionButtons={["edit", "delete"]}
                onEditClick={handleVenueEditClick}
              />

              <PaginationComponent
                totalItems={filteredVenues.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              
              />

            </div>
            {isEditModalOpen && currentVenue && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center bg-black/60 backdrop-blur justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Edit Venue</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Venue Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
                <input
                  type="text"
                  name="name"
                  value={currentVenue.name}
                  onChange={handleVenueEditChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={currentVenue.address}
                  onChange={handleVenueEditChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={currentVenue.country}
                  onChange={handleVenueEditChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              {/* Postal Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  name="postal_code"
                  value={currentVenue.postal_code}
                  onChange={handleVenueEditChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={currentVenue.capacity}
                  onChange={handleVenueEditChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              {/* Contact Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={currentVenue.contact_phone}
                  onChange={handleVenueEditChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              {/* Contact Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  name="contact_email"
                  value={currentVenue.contact_email}
                  onChange={handleVenueEditChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveVenue}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
          </div>
          
        )

      default:
        return <div>Select a section from the sidebar</div>
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        {/* <Topbar /> */}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">{renderSection()}</main>
      </div>
    </div>
  )
}
}

export default Admin
