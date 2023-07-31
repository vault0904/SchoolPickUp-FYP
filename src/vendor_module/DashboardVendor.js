// import React, {useState, useEffect} from 'react'
// import {
//   Card,
//   CardBody,
//   Typography,
//   CardHeader,
//   Button,
// } from '@material-tailwind/react'
// import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
// import '../css/defaultstyle.css'
// import DefaultSchoolLogo from '../assets/images/schoollogo.jpg'

// // A table from database that contains pickup information
// const PICKUP = [
//   {
//     id: "01",
//     date: "03 July 2023", 
//     number: "15",
//     time: "1335",
//     schoolid: "05",
//     schoolname: "Admiralty Primary School",
//     assignedbusvendorid: "99",
//     assignedbusdriverid: "10",
//     assignedbusdrivername: "LEOX GYASI",
//     assignedbusdriverlicense: "B19363B"
//   },
// ]

// export default function DashboardVendor() {
//   // Store list of school IDs associated with vendor in state
//   const [schoolIds, setSchoolIds] = useState([]);
//   useEffect(() => {
//     // Get the stored array of school IDs from localStorage
//     const storedSchoolIdsString = localStorage.getItem('assoc_schools');

//     // Parse the string back to an array of strings
//     const storedSchoolIds = JSON.parse(storedSchoolIdsString);

//     // Update the state with the array of school IDs
//     setSchoolIds(storedSchoolIds);
//   }, []);

//   // Get today's date in the format "DD-Month-YYYY"
//   // Find the pickup object with today's date
//   // Get the vendor vendor name
//   const today = new Date().toLocaleDateString('en-UK', { day: '2-digit',month: 'long', year: 'numeric' });
//   const todayPickup = PICKUP.find(pickup => pickup.date === today);
//   const vendorname = localStorage.getItem('vendorname').toUpperCase();

//   // Need a 'get' method API that returns data from school table, 
//   // Use the school ID stored in local storage to find the correct school to return the data
//   const API_URL = 'https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/'

//   // Need a 'get' method API that returns data from pickup table,
  
//   return (
//     <>
//       <div>
//         <p style={{color: '#56844B', fontWeight: 'bold'}}>
//           Welcome, VENDOR {vendorname}
//         </p> 
//       </div>

//       <div style={{marginTop: '30px', color: '#5c5c5c'}}>
//         {vendorname} has been assigned to: 
//       </div>

//       {/* School information card */}
//       <Card className="flex-row w-full max-w-[48rem]" style={{marginTop: '15px'}}>
//         <CardHeader shadow={false} floated={false} className="w-2/5 shrink-0 m-0 rounded-r-none">
//           <img src={DefaultSchoolLogo} alt="image"  style={{marginLeft: '10%'}}/>
//         </CardHeader>
//         <CardBody style={{marginTop: '25px'}}>
//           <Typography variant="h4" color="blue-gray" className="mb-2">Admiralty Primary School</Typography>
//           <Typography color="gray" className="font-normal">
//             Address: 11 Woodlands Cir, Singapore 738907
//           </Typography>
//           <Typography color="gray" className="font-normal mb-4">
//             Contact: 6372 9372
//           </Typography>
//           <a className="inline-block" >
//             <Button variant="text" className="flex gap-2" style={{paddingLeft: '0px'}}>
//               View more information <ArrowLongRightIcon strokeWidth={2} className="w-4 h-4" />
//             </Button>
//           </a>
//         </CardBody>
//       </Card>

//       {/* Assignment information */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', color: '#5c5c5c'}}>
//         <div>
//           <p>Child opted in for pickup today</p>
//           {/* Need to add && operator later, to make the ternary below check for matching vendor id + today's pickupdate */}
//           {/* todayPickup && todayPickup.assignedbusvendorid === "XYZ"  ?  ( */}
//           {todayPickup ? (
//               <p>{todayPickup.number}</p>
//             ) : ( <p>No pickup information for today</p> )
//           }
//           <br/>
//           <p>Dismissal time for today, {today}</p>
//           {todayPickup ? (
//               <p>{todayPickup.time}</p>
//             ) : ( <p>No pickup information for today</p> )
//           }
//         </div>
        
//         <div>
//           <p>Drivers assigned for today</p>
//           {todayPickup ? (
//             <>
//               <p>{todayPickup.assignedbusdrivername}</p>
//               <p>{todayPickup.assignedbusdriverlicense}</p>
//             </>
//             ) : ( <p>No pickup information for today</p> )
//           }          
//         </div>
//       </div>
//     </>
//   )
// }


















//VENDOR DASHBOARD KIV, WIP
import React, {useState, useEffect} from 'react'
import {
  Card,
  CardBody,
  Typography,
  CardHeader,
  Button,
} from '@material-tailwind/react'
import axios from 'axios';
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import '../css/defaultstyle.css'
import DefaultSchoolLogo from '../assets/images/schoollogo.jpg'

export default function DashboardVendor() {
  // Store list of school IDs associated with vendor in state
  const [schoolIds, setSchoolIds] = useState([]);
  useEffect(() => {
    // Get the stored array of school IDs from localStorage
    const storedSchoolIdsString = localStorage.getItem('assoc_schools');

    // Parse the string back to an array of strings
    const storedSchoolIds = JSON.parse(storedSchoolIdsString);

    // Update the state with the array of school IDs
    setSchoolIds(storedSchoolIds);
  }, []);

  // Retrieve school information
  useEffect(() => {
    if (schoolIds && schoolIds.length > 0) {
      axios.get('https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/ven-getassociatedschools', {
        params: {
          schoolIds: schoolIds
        }
      })
      .then (res => {
        console.log(res.data)
      })
      .catch (err => {
        console.error(err);
      })
    }
  }, [schoolIds])
  
  return (
    <>
        {/* School information card */}
        <Card className="flex-row w-full max-w-[48rem]" style={{marginTop: '15px'}}>
        <CardHeader shadow={false} floated={false} className="w-2/5 shrink-0 m-0 rounded-r-none">
          <img src={DefaultSchoolLogo} alt="image"  style={{marginLeft: '10%'}}/>
        </CardHeader>
        <CardBody style={{marginTop: '25px'}}>
          <Typography variant="h4" color="blue-gray" className="mb-2">Admiralty Primary School</Typography>
          <Typography color="gray" className="font-normal">
            Address: 11 Woodlands Cir, Singapore 738907
          </Typography>
          <Typography color="gray" className="font-normal mb-4">
            Contact: 6372 9372
          </Typography>
          <a className="inline-block" >
            <Button variant="text" className="flex gap-2" style={{paddingLeft: '0px'}}>
              View more information <ArrowLongRightIcon strokeWidth={2} className="w-4 h-4" />
            </Button>
          </a>
        </CardBody>
      </Card>
    </>
  )
}
