import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { 
  Card, 
  CardBody,
  CardHeader, 
  Typography, 
  Tooltip, 
  IconButton,
} from "@material-tailwind/react";
import { 
  CButton,
  CModal,
  CForm,
  CFormInput, 
  CFormLabel,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import CIcon from '@coreui/icons-react'
import { cilPencil } from "@coreui/icons"
import '../css/defaultstyle.css';
import DefaultSchoolLogo from '../assets/images/schoollogo.jpg'

export default function ViewVehiclePickUpJobs() {
  // Get the school_ID which the vendor click in the DashboardVendor page
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const school_ID = searchParams.get('school_ID');

  // Get todays' date
  // +8 hours for singapore timezone GMT+8
  const datetime = new Date();
  datetime.setHours(datetime.getHours() + 8);
  const singaporeDatetime = datetime.toISOString().split('T')[0];

  // The 2 fixed pickup timing for vehicle pickup
  // Timeslot 1 and 2
  const TS1 = '2:30pm';
  const TS2 = '5:30pm';

  // Declare array for pick up jobs, in each region, for each pickup timeslot, 
  // Default of 0 jobs 
  const pickUpJobsDefaultTS1 = [
    {'Region': 'North', 'Capacity': 0},
    {'Region': 'West', 'Capacity': 0}, 
    {'Region': 'East', 'Capacity': 0},
    {'Region': 'South', 'Capacity': 0},
    {'Region': 'Central', 'Capacity': 0},
  ]

  const pickUpJobsDefaultTS2 = [
    {'Region': 'North', 'Capacity': 0},
    {'Region': 'West', 'Capacity': 0}, 
    {'Region': 'East', 'Capacity': 0},
    {'Region': 'South', 'Capacity': 0},
    {'Region': 'Central', 'Capacity': 0},
  ]

  // Retrieve school details
  const [schoolData, setSchoolData] = useState([])
  useEffect(()=> {
    axios.get(`https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/ven-getschooldetails/${school_ID}`)
    .then(res=>{
      setSchoolData(res.data)
    })
  }, [school_ID])

  // Retrieve data from vehiclepickup_jobs table in DB
  const [retrievePickUpJobsTS1, setRetrievePickUpJobsTS1] = useState([])
  const [retrievePickUpJobsTS2, setRetrievePickUpJobsTS2] = useState([])

  useEffect(()=>{
    Promise.all([
      axios.post('https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/ven-getvehiclepickupjobstimeslot1', {
        si: school_ID,
        d: singaporeDatetime,
        ts1: TS1,
      }),
      axios.post('https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/ven-getvehiclepickupjobstimeslot2', {
        si: school_ID,
        d: singaporeDatetime,
        ts2: TS2,
      })
    ])
      .then(([ts1Res, ts2Res]) => {
        setRetrievePickUpJobsTS1(ts1Res.data.r1)
        setRetrievePickUpJobsTS2(ts2Res.data.r2)
      })
      .catch(err => {
        console.error(err);
      });
  }, [school_ID])

  // Map the data received from vehiclepickup_jobs table
  // Meaning if there was data retrieved from DB, it will replace the default value of 0 jobs, otherwise, jobs for the region will still be 0
  const [pickUpJobsTodayTS1, setPickUpJobsTodayTS1] = useState([])
  const [pickUpJobsTodayTS2, setPickUpJobsTodayTS2] = useState([])

  // Mapping for timeslot 1
  useEffect(() => {
    const matchPickUpJobsTodayTS1 = pickUpJobsDefaultTS1.map(defaultItem => {
      const matchRetrievePickUpJob = retrievePickUpJobsTS1.find(job => job.dropoff_Region === defaultItem.Region)

      if (matchRetrievePickUpJob) {
        return {
          Region: defaultItem.Region,
          Capacity: matchRetrievePickUpJob.capacity
        }
      } else {
        return defaultItem;
      }
    })
    setPickUpJobsTodayTS1(matchPickUpJobsTodayTS1);
  }, [retrievePickUpJobsTS1])

  // Mapping for timeslot 2
  useEffect(() => {
    const matchPickUpJobsTodayTS2 = pickUpJobsDefaultTS2.map(defaultItem => {
      const matchRetrievePickUpJob = retrievePickUpJobsTS2.find(job => job.dropoff_Region === defaultItem.Region)

      if (matchRetrievePickUpJob) {
        return {
          Region: defaultItem.Region,
          Capacity: matchRetrievePickUpJob.capacity
        }
      } else {
        return defaultItem;
      }
    })
    setPickUpJobsTodayTS2(matchPickUpJobsTodayTS2);
  }, [retrievePickUpJobsTS2])

  return (
    <>
      <div className="flex flex-col items-left mt-3 mb-4">
        {schoolData.map((i, idx) => (
        <>
          {/* <Card key={i.school_ID} className="flex-row w-3/4 justify-center max-w-[48rem]" style={{ marginTop: '15px' }}>
            <CardHeader shadow={false} floated={false} className="w-2/5 shrink-0 m-0 rounded-r-none">
              <img src={i.imageURI ? i.imageURI : DefaultSchoolLogo} alt="image" />
            </CardHeader>
            <CardBody style={{ marginTop: '25px' }}>
              <Typography variant="h4" color="blue-gray" className="mb-4">
                {i.school_Name}
              </Typography>
              <Typography color="gray" className="font-normal mb-4">
                Address: {i.address}
              </Typography>
              <Typography color="gray" className="font-normal mb-4">
                Contact: {i.contactNo}
              </Typography>
              <Typography color="gray" className="font-normal mb-4">
                Type: {i.type}
              </Typography>
            </CardBody>
          </Card> */}

          <div className="px-4 pt-4">
            <p className="font-bold text-lg" style={{ fontSize: '20px', color: '#56844B' }}>
              Vehicle pick up jobs for {i.type} - {i.school_Name}
            </p>
          </div>
        </>
        ))}

        <div className="flex px-4 pt-10">
          <p className="font-bold text-lg" style={{ fontSize: '20px', color: '#56844B' }}>
            Timeslot 1 : {TS1}
          </p>

          {pickUpJobsTodayTS1.slice(0, 5).map((item, index) => (
            <Typography variant="lead" className="p-2">
              {item.Region} Region | Confirmed Jobs: <b>{item.Capacity}</b>
            </Typography>
          ))}
        </div>

        <div className="flex px-4 pt-20">
          <p className="font-bold text-lg" style={{ fontSize: '20px', color: '#56844B' }}>
            Timeslot 2 : {TS2}
          </p>

          {pickUpJobsTodayTS2.slice(0, 5).map((item, index) => (
            <Typography variant="lead" className="p-2">
              {item.Region} Region | Confirmed Jobs: <b>{item.Capacity}</b>
            </Typography>
          ))}
        </div>
      </div>
    </>
  )
}