import React, { useEffect, useState } from 'react'
import CollapsibleSection from '../components/CollapsibleSection';
import DatePicker from 'react-datepicker';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
// import { MdOutlineCancel } from "react-icons/md";
import { MdOutlineDeleteForever as Delete } from "react-icons/md";
import { GoPeople as People } from "react-icons/go";
import { CiLocationOn as Location } from "react-icons/ci";
import { LuTicketSlash as Ticket } from "react-icons/lu";
import { AiOutlineClose } from "react-icons/ai";
import { FiTag as Tag } from "react-icons/fi";
import { CiCalendar as Calender } from "react-icons/ci";
import { FaRegFileLines as Text } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import axios from 'axios'
// import { v4 as uuidv4 } from 'uuid'; 
import uuid from 'uuid4'
import moment from 'moment';
import CustomSelectDropdown from '../components/CustomSelectDropdown';



export default function CreateEvent() {
    const [images,setImages] = useState([])

    const [tickets,setTicket] = useState([{id:uuid(),type:'Standard',quantity:100,price:100}]);
    console.log(tickets);
    const [event,setEvent] = useState(
      {title:'',description:'' ,category:'', organizer_id: 1, category_id: 2,venue_id:6,
        start_datetime:moment(),end_datetime:moment(),venue:'',tickets:tickets ,max_attendees:''

      });
 
      console.log(event.start_datetime)
      
     
      // console.log(images[0]);

      // if (!event.title || !event.start_datetime || tickets.length === 0) {
      //   alert("Please fill all required fields.");
      //   return;
      // }



   
    // const [formData, setFormData] = useState({}); 

    // Sync tickets with eventDetails
    useEffect(() => {  
      setEvent(prev => ({
        ...prev,
        tickets: tickets
      }));
    }, [tickets]);


    function toMySQLDatetime(isoDate) {
      const date = new Date(isoDate);
      return date.toISOString().slice(0, 19).replace('T', ' ');
    }

      
    const handleSubmit = async(e) => {
      e.preventDefault();
      event.start_datetime = toMySQLDatetime(event.start_datetime)
      event.end_datetime = toMySQLDatetime(event.end_datetime)
      console.log(event)


      const formData = new FormData();
      formData.append("event",JSON.stringify(event));
      images?.forEach((imageObj) => {
         formData.append('images',imageObj.file)

      })

      console.log(formData)

      try{

     const response = await axios.post('http://localhost:3000/api/events',formData,{
        headers:{
          'Content-Type':'multipart/form-data'
        }})
        console.log('Event created:', response.data);
        alert('Event created successfully!');

      }catch(error){
        console.error('Error creating event:', error.response?.data || error.message);
          alert('Failed to create event.');

      }


    






      



      
      // alert('Ahh I see!! you are trying to submit the right')

}



    const cancelEvent = () => {
      setEvent({title:'',description:'' ,category:'',
        start_datetime:moment(),end_datetime:moment(),venue:'',tickets:tickets ,max_attendees:''

      })
    }


    
   
    const dragndrop_handler = (e) => {
        
            e.preventDefault()
            const files = e.dataTransfer.files;
            updateImages(files)

            // console.log(files)

    }

    const removeImage = (indexToRemove) => {
      const updatedImages = images.filter((_, index) => index !== indexToRemove);
      
      setImages(updatedImages);}
    

    const addTicket = () => {
        // console.log(e)
        setTicket(prev => [...prev,{id:uuid(),type:''}])
    }

    const handleTicketType = (id,updateField) => {
        
          setTicket(prevTicket => prevTicket.map(ticket => ticket.id === id ? {...ticket,...updateField}: ticket))

    }

    const handleDelete = (ticket_id) => {
      setTicket(prev => prev.filter((fil_ticket,index) => index=== 0 || ticket_id !== fil_ticket.id ))


    }

    useEffect(() => {
      return () => {
        images.forEach(img => URL.revokeObjectURL(img.url));
      };
    }, [images]);
    

   

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)
        updateImages(files)
    }

    const getTicketTypeColor = (type) => {
      switch (type) {
        case "vip":
          return "bg-purple-100 px-1 text-purple-800 border-purple-200"
        case "early bird":
          return "bg-blue-100 px-1 text-blue-800 border-blue-200"
        case "standard":
          return "bg-green-100 px-1 text-green-800 border-green-200"
        case "free":
          return "bg-gray-100 px-1 text-gray-800 border-gray-200"
        default:
          return "bg-gray-100 px-1 text-gray-800 border-gray-200"
      }
    }

   const eventPropSetter = (prop) => setEvent((prev) => ({...prev,...prop}))
    const updateImages = (files) => {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        const imagePreviews = imageFiles.map(file => ({
          file,
          url: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...imagePreviews]);
      };
  return (
    <div className='flex justify-center'>
    <div>
    <section className='m-8 max-w-2xl'>
    <header className=' p-8 '>
        <div className='text-2xl font-bold py '>Create New Event</div>
        <div className='text-gray-600'>Fill in the details below to create a new Event on Evenera</div>
    </header>

   <div  className="w-full max-w-2xl min-w-[600px]">
    <form className='shadow-2xl p-6   max-w-2xl w-full overflow-hidden  rounded-lg flex flex-col ' onSubmit={handleSubmit}>
        <div className='px-8 py-4 bg-gradient-to-r from-[#2762EB] to-[#a45eed] text-white '>
            <h3 className='font-bold  '>Event Details</h3>
            <p className='text-xs '>create an unforgettable experience</p>

        </div>
       <div className='px-8'>
        <div>
            <p>Event Images</p>
            
            <div className='border-2 border-blue-500 py-10 flex flex-col items-center border-dashed rounded-xl ' onDrop= {dragndrop_handler} onDragOver={e => e.preventDefault()} >
             <div>
             <p className='font-bold'>Drag and drop your images Here</p>
             <p className='text-gray-400'>PNG,JPG,GIF up to 10MB</p>
             </div>
            
              <input type="file" id='file-upload' accept='image/*' multiple hidden onChange={handleFileChange} className='w-fit ' />
              <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Select Files
                </label>
                </div>
                  {/* Image preview section */}
         
           <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded">
  {images.map((img, index) => (
    <div 
      key={index}
      className="group aspect-[4/3] w-full overflow-hidden rounded-lg shadow-lg border-2 border-gray-200 relative hover:border-gray-400 transition-all"
    > 
      <img
        src={img.url}
        alt={`upload-preview-${index}`}
        className="w-full h-full object-cover object-center group-hover:brightness-90 transition-all"
      />
      <button 
        className="absolute top-2 right-2 bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-500"
        onClick={(e) => {
          e.stopPropagation();
          removeImage(index);
        }}
      >
        <AiOutlineClose size={15} />
      </button>
    </div>
  ))}
</div>

            
            
        </div>
        {/*   -----------   Events Details  section --------------- */}
        <div>
        <CollapsibleSection title={'Basic Information'}>
                    <div>
                        <label htmlFor="title" className="block font-medium">Event Title *</label>
                         {/* <input  type="text" id="title" onInput={(e) => setEvent(prev => ({...prev, eventTitle: e.target.value}))} className="w-full border px-3 py-2 rounded" placeholder="Enter event title"/> */}
                         <input  type="text" id="title" onInput={(e) => eventPropSetter({title:e.target.value})} className="w-full border px-3 py-2 rounded" placeholder="Enter event title"/>
                    </div>

                    <div>
                        <label htmlFor="description" className="block font-medium">Description *</label>
                        <textarea onInput={(e) => eventPropSetter({description: e.target.value})} id="description" className="w-full border px-3 py-2 rounded" placeholder="Describe your event"></textarea>
                    </div>

                     <CustomSelectDropdown
                      label={'Category'}
                      name={'category'}
                      value={event.category}
                      options={['Conference','Concert','Networking','Workshop']}
                      onChange={(e) => eventPropSetter({category:e.target.value})} required
                      
                      ></CustomSelectDropdown>
         </CollapsibleSection>


         <CollapsibleSection title={'Date and Time'}>
         <div className='flex justify-between gap-8'>
            <div className='flex-1'>
            <label className="block font-medium mb-2">Start Date & Time</label>
         <Datetime
                value={event.start_datetime}
                onChange={(date) => eventPropSetter({ start_datetime: date })}
    
                dateFormat="MMMM Do, YYYY"
                timeFormat="hh:mm A"
                inputProps={{ placeholder: "Select start date & time" }}
             />
        </div>

            <div className='flex-1'>
            <label className="block font-medium mb-2">End Date & Time</label>
            <Datetime
                 value={event.end_datetime}
                 onChange={(date) => eventPropSetter({end_datetime:date})}
                 dateFormat="MMMM Do, YYYY"
                 timeFormat="hh:mm A"
                 inputProps={{ placeholder: "Select end date & time" }}
        />
      </div>
    </div>



         </CollapsibleSection>

         <CollapsibleSection title={'Location'}>
         <CustomSelectDropdown label={'Venue'} name={'location'}
                      value={event.venue}
                      options={['Hyatt Regency,Kathmandu','Phoenix Chautari,Baglung','Hyperspace,Pokhara']}
                      placeholder='Select a Venue'
                      onChange={(e) => eventPropSetter({venue:e.target.value})} required />

         </CollapsibleSection>


         <CollapsibleSection title={'Tickets'} >
          
          <div className='flex justify-between'>
            <h3>Ticket types</h3>
            <h3 className="cursor-pointer" onClick={addTicket}><span className='p-2 border border-gray-400 font-bold '><span className='p-2'>+</span>Add Ticket</span> </h3>
          </div>
          {/* 🧠 Pro Tip: Using Unique IDs to be implemented */}
          {tickets.map((ticket,index) => (
            <div key={index} className=' w-md shadow bg-gray-50  p-2.5 rounded'>
          
          <div className='flex justify-between'>
                <div><p>Ticket#{index+1}</p></div>
                <div className='cursor-pointer pr-4' onClick={() => handleDelete(ticket.id) }><Delete size={25} color='red'/></div>

          </div>
          
          <div className="flex gap-4">
  <div className="w-1/3">
    <CustomSelectDropdown
      label="Type"
      name="ticket"
      value={ticket.type}
      options={['VIP', 'Early bird', 'Standard', 'Free']}
      placeholder="Select type"
      onChange={(e) => handleTicketType(ticket.id,{type:e.target.value})}
      required
    />
  </div>

  <div className="w-1/3">
    <label className="block font-medium mb-1">Quantity *</label>
    <input
      type="number"
      placeholder="Enter quantity"
      onBlur={(e) => handleTicketType(ticket.id,{quantity:e.target.value})}
      className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div className="w-1/4">
    <label className="block font-medium mb-1">Price *</label>
    <input
      type="number"
      placeholder="Rs 0.0"
      onChange={(e) => handleTicketType(ticket.id,{price:e.target.value})}
      className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</div>
</div>

          )) }
 
    

 



         </CollapsibleSection>


         <CollapsibleSection title={'Capacity and Pricing'} >
                    <div>
                        <label htmlFor="max-attendees" className="block font-medium">Max Attendees *</label>
                         <input type="number" id="max-attendees" onInput={(e) => eventPropSetter({max_attendees:e.target.value})} className="w-full border px-3 py-2 rounded" placeholder="Enter maximum attendees"/>
                    </div>

         </CollapsibleSection>
         

        </div>
        </div> 
        <div className='flex justify-between mt-4'>
        <button type='reset' onClick={cancelEvent} className=' bg-gray-200 text-black shadow-[0_0_0_2px_rgba(209,213,219,1)] rounded px-4 py-2 cursor-pointer'>Cancel</button>
        <button type='submit' className='p-3 bg-gradient-to-r from-[#2762EB] to-[#6d22bc] text-white rounded cursor-pointer '>Create Event</button>
    </div> 
    </form></div>
    
    </section>
</div>
<div className='sticky top-4 h-fit self-start'>
<section className="w-md h-fit mx-auto p-4 ">
  <div>
    <h2 className="text-xl font-semibold mb-4">Event Preview</h2>
  </div>

  <div className="bg-white rounded-xl text-xs shadow p-4 space-y-4 border-s-2">
  {/* Event Banner Image with Overlay */}
  <div className="relative rounded-lg  overflow-hidden h-48">
    {images.length > 0 && (
      <>
        {/* Main Image */}
        <img
          src={images[0].url}
          alt={images[0].file.name}
          className="w-full h-full object-cover"
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-end p-4">
          {/* Event Title */}
          <h3 className="text-xl font-bold text-white drop-shadow-lg">
            {event.title || "Event Title"}
          </h3>
        </div>
      </>
    )}
  </div>

          {/* Description */}
          {event.description && 
      <div className="text-sm flex gap-1.5 text-gray-600 overflow-clip space-y-2">
         <div><Text/></div>
          <div><span >{event.description}</span></div>
        </div>}
        {/* Event type */}

        {event.category && 
        <div className='flex gap-1.5'>
             <div><Tag size={15} /></div>
             <div><span>{ event.category }</span></div>
        </div>}


        {/* Date and time */}
          {event.start_datetime && event.end_datetime &&
          <div className='flex gap-1.5'>
            <div><Calender size={18}/></div>
            <div>{event.start_datetime?.format('dddd, MMMM D, YYYY HH:mm')} - {event.end_datetime?.format('HH:mm')}</div>
            </div>}

        {/* Venue */}

         {event.venue && 
        <div className='flex gap-1.5'> 
        <div><Location size={18}/></div>
          <div>{event.venue}</div>
        </div>}


        {/* Tickets */}

        <div >
           <div className='flex gap-1.5 mb-2.5'>
           <div ><Ticket size={15}/></div>
           <label htmlFor="">Available Tickets</label>

           </div>
         

        
          <div className='flex flex-col gap-2'>
          {tickets.length > 0 && tickets.map((ticket,index) => (
            ticket.type && (
            <div key={index} className='flex gap-2'>
                 
                 <div className={getTicketTypeColor(ticket.type.toLowerCase())}><span>{ticket.type}</span></div>
                  <div  ><span>{ticket.quantity} tickets</span></div>
                  <div><span>Rs {ticket.price}</span></div>
                
                
          
          </div>)
         
          
          
          
           ))} </div>
        </div>

        {/* Max attendees */}
        {event.max_attendees > 0 &&

        <div className='flex gap-1.5'>
           <div><People size={15}/></div>
          <div><span>Max {event.max_attendees} attendees</span></div>
        </div>}

        {/* image gallary */}


       {images.length >=1 && 
        <div>
          <div><span>Event Gallery ({images.length} images)</span></div>
          <div className="grid grid-cols-4 gap-0">

        {images.slice(1, 4).map((image, index) => (
          <div key={index} className="rounded overflow-hidden  ">
            <img
              src={image.url}
              alt={image.file.name}
              className="w-20 h-20 object-cover "
            />
          </div>))}

       
    

         
            {/* "+X more" indicator - INSIDE the grid container */}
    {images.length > 4 && (
      <div className="w-20 h-20 rounded bg-gray-100 aspect-square flex items-center justify-center">
        <span className="text-gray-600 font-medium">
          +{images.length - 4}
        </span>
      </div>
    )}
      </div>

     
        </div>}






</div>

  
  
</section>
</div>


</div>

  )
}
