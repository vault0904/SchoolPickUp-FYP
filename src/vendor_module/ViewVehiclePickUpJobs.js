import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { 
  Card, 
  CardBody, 
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

export default function ViewVehiclePickUpJobs() { 
  // Get the school_ID which the vendor click in the DashboardVendor page
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const school_ID = searchParams.get('school_ID');

  // Get todays

  // Retrieve data from vehiclepickup_jobs table in DB
  useEffect(()=>{
    axios.get(`https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/ven-getvehiclepickupjobs/${school_ID}`)
    .then(res=>{
      // alert(res.data.r)
    })
  }, [school_ID])

  return (
    <>
      
    </>
  )
}