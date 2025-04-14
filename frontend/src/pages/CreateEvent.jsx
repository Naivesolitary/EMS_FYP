import React, { useEffect, useState } from 'react'
import CollapsibleSection from '../components/CollapsibleSection';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { MdOutlineCancel } from "react-icons/md";
import { MdOutlineDeleteForever as Delete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
// import { v4 as uuidv4 } from 'uuid'; 
import uuid from 'uuid4'
import moment from 'moment';
import CustomSelectDropdown from '../components/CustomSelectDropdown';


export default function CreateEvent() {
    const [images,setImages] = useState([])
    const [eventDesc,setEventDesc] = useState('')
    const [selectCategory, setSelectedCategory] = useState('')
    const [selectVenue, setSelectedVenue] = useState('')
    const [tickets,setTicket] = useState([{id:uuid(),type:''}]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
   
    const dragndrop_handler = (e) => {
        
            e.preventDefault()
            const files = e.dataTransfer.files;
            updateImages(files)

            // console.log(files)

    }

    const addTicket = () => {
        // console.log(e)
        setTicket(prev => [...prev,{id:uuid(),type:''}])
    }

    const handleTicketType = (id, value) => {
          setTicket(prevTicket => prevTicket.map(ticket => ticket.id === id ? {...ticket,type:value}: ticket))

    }

    const handleDelete = (ticket_id) => {
      setTicket(prev => prev.filter(fil_ticket => ticket_id !== fil_ticket.id ))


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
    <form className='shadow-2xl p-6   max-w-2xl w-full overflow-hidden  rounded-lg flex flex-col ' action="">
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
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4  p-4 rounded ">
        {images.map((img, index) => (
           <div 
           key={index}
      className="aspect-[4/3] w-full overflow-hidden rounded shadow border border-red-500"
           > 
          <img
            key={index}
            src={img.url}
            alt={`upload-preview-${index}`}
            className="w-full h-full object-cover object-center rounded shadow border  border-red-500"
          />
          <MdOutlineCancel/>
          </div>
        ))}
      </div>
            
            
        </div>
        {/*   -----------   Events Details  section --------------- */}
        <div>
        <CollapsibleSection title={'Basic Information'}>
                    <div>
                        <label htmlFor="title" className="block font-medium">Event Title *</label>
                         <input  type="text" id="title" className="w-full border px-3 py-2 rounded" placeholder="Enter event title"/>
                    </div>

                    <div>
                        <label htmlFor="description" className="block font-medium">Description *</label>
                        <textarea onInput={(e) => setEventDesc(e.target.value )} id="description" className="w-full border px-3 py-2 rounded" placeholder="Describe your event"></textarea>
                    </div>

                     <CustomSelectDropdown
                      label={'Category'}
                      name={'category'}
                      value={selectCategory}
                      options={['Conference','Concert','Networking','Workshop']}
                      onChange={(e) => setSelectedCategory(e.target.value)} required
                      
                      ></CustomSelectDropdown>
         </CollapsibleSection>


         <CollapsibleSection title={'Date and Time'}>
         <div className='flex justify-between gap-8'>
            <div className='flex-1'>
            <label className="block font-medium mb-2">Start Date & Time</label>
         <Datetime
                value={startDate}
                onChange={setStartDate}
                dateFormat="MMMM Do, YYYY"
                timeFormat="hh:mm A"
                inputProps={{ placeholder: "Select start date & time" }}
             />
        </div>

            <div className='flex-1'>
            <label className="block font-medium mb-2">End Date & Time</label>
            <Datetime
                 value={endDate}
                 onChange={setEndDate}
                 dateFormat="MMMM Do, YYYY"
                 timeFormat="hh:mm A"
                 inputProps={{ placeholder: "Select end date & time" }}
        />
      </div>
    </div>



         </CollapsibleSection>

         <CollapsibleSection title={'Location'}>
         <CustomSelectDropdown label={'Venue'} name={'location'}
                      value={selectVenue}
                      options={['Hyatt Regency,Kathmandu','Phoenix Chautari,Baglung','Hyperspace,Pokhara']}
                      placeholder='Select a Venue'
                      onChange={(e) => setSelectedVenue(e.target.value)} required />

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
                <div className='cursor-pointer pr-4' onClick={() => handleDelete(ticket.id) }><Delete size={25} color='gray'/></div>

          </div>
          
          <div className="flex gap-4">
  <div className="w-1/3">
    <CustomSelectDropdown
      label="Type"
      name="ticket"
      value={ticket.type}
      options={['VIP', 'Early bird', 'Standard', 'Free']}
      placeholder="Select type"
      onChange={(e) => handleTicketType(ticket.id,e.target.value)}
      required
    />
  </div>

  <div className="w-1/3">
    <label className="block font-medium mb-1">Quantity *</label>
    <input
      type="number"
      placeholder="Enter quantity"
      className="w-full h-10 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div className="w-1/4">
    <label className="block font-medium mb-1">Price *</label>
    <input
      type="number"
      placeholder="Rs 0.0"
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
                         <input type="number" id="max-attendees" className="w-full border px-3 py-2 rounded" placeholder="Enter maximum attendees"/>
                    </div>

         </CollapsibleSection>

        </div>
        </div>  
    </form></div>
    <div className='flex justify-between mt-4'>
        <button className=' bg-gray-200 text-black shadow-[0_0_0_2px_rgba(209,213,219,1)] rounded px-4 py-2 cursor-pointer'>Cancel</button>
        <button className='p-3 bg-gradient-to-r from-[#2762EB] to-[#6d22bc] text-white rounded cursor-pointer '>Create Event</button>
    </div>
    </section>
</div>
<div className='sticky top-4 h-fit self-start'>
<section className="w-md h-fit mx-auto p-4 ">
  <div>
    <h2 className="text-xl font-semibold mb-4">Event Preview</h2>
  </div>

  <div className="bg-white rounded-xl shadow p-4 space-y-4 border-s-2">
          {/* Event Banner Image */}
            <div className="rounded overflow-hidden">
            {images.length > 0 && (
           <img
           src={images[0].url}
          alt={images[0].file.name}
         className="w-full h-48 object-cover"
      />
)}
          </div>

            {/* Event Title */}

      <div><h3 className="text-lg font-bold">Berserk Fan Meet up</h3></div>

          {/* Description */}
      <div className="text-sm text-gray-600 space-y-2">
         
          <span>{eventDesc}</span>
        </div>
        {/* Event type */}

        <div>
          <span>Otaku</span>
        </div>


        {/* Date and time */}

        <div>
          Thrusday,April 10, 2025
        </div>

        {/* Venue */}

        <div>
          Phoenix Chautari, USA
        </div>


        {/* Tickets */}

        <div cla>
          <label htmlFor="">Available Tickets</label>
          <div className='flex gap-8'>
            <div><span>Standard</span></div>
            <div><span>100 tickets</span></div>
            <div><span>Rs 250</span></div>
          </div>
        </div>

        {/* Max attendees */}

        <div>
          <span>Max 2500 attendees</span>
        </div>

        {/* image gallary */}

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
      <div className="rounded bg-gray-100 aspect-square flex items-center justify-center">
        <span className="text-gray-600 font-medium">
          +{images.length - 4}
        </span>
      </div>
    )}
      </div>

     
        </div>




</div>

  
  
</section>
</div>


</div>

  )
}
