import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CRow,
  CFormSelect,
} from '@coreui/react';
import BrandImage from '../assets/images/logo1.jpg';
import '../scss/login.scss'
import axios from 'axios';


export default function Login() {
  // Hooks for login form
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('sys-adm');  // Set default as 'sys-adm' because that is the first choice of the CFormSelect, and we are accounting for the situation that system admin did not touch the drop down box at all during login. If that scenario happens then default value 'sys-adm' will come into play when API request is sent
  const navigate = useNavigate(); 

  // API URL for login
  const API_WEBLOGIN = 'https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/weblogin';
  
  const handleLogin = async () => {
    try {
      const response = await axios.post(API_WEBLOGIN, {
        userid: userid,
        password: password,
        usertype: usertype,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response) {
        // Get response returned by API
        // Response returns either {success: true, userid: '123' usertype: 'sys-adm' etc} or {success: false}
        const data = response.data;
  
        // If API returns false, meaning authentication failed
        if (!data.success) {
          // Inform user wrong login credentials
          alert('Wrong userid or password')
          window.location.reload();
        } else {
          // Else proceed to log user in to their dashboard
          // However before that, we store the relevant user details in local storage, such as their names, so that we can use it to display in their dashboard for example
  
          // Get usertype from API response, store in local storage
          const usertype = data.usertype;
          localStorage.setItem('usertype', usertype)
  
          switch (data.usertype) {
            case "sys-adm":
              // Retrieve relevant details from API response
              const sysadmid = data.userid;
              const sysadmfirstname = data.firstName;
              const sysadmlastname = data.lastName;
              // Store relevant details
              localStorage.setItem('userid', sysadmid)
              localStorage.setItem('firstname', sysadmfirstname)
              localStorage.setItem('lastname', sysadmlastname)
              // Navigate the user to their appropriate dashboard
              navigate('/system-admin/dashboard');
              break;
  
            case "sch-adm":
              // Retrieve relevant details from API response
              const schadmid = data.userid;
              const schadmfirstname = data.firstName;
              const schadmlastname = data.lastName;
              const schadmschoolid = data.school_ID;
              // Store relevant details
              localStorage.setItem('userid', schadmid)
              localStorage.setItem('firstname', schadmfirstname)
              localStorage.setItem('lastname', schadmlastname)
              localStorage.setItem('schoolid', schadmschoolid)
              // Navigate the user to their appropriate dashboard
              navigate('/school-admin/dashboard');
              break;
  
            case "ven":
              // Retrieve relevant details from API response
              const vendorid = data.userid;
              const vendorname = data.vendor_Name;
              // Find all the schools that are associated with the vendor (school_vendor table)
              // axios get request 
              axios.get(`https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/ven-getassociatedschools/${vendorid}`)
              .then (res => {
                const venschoolids = res.data;
                // Store relevant details
                localStorage.setItem('userid', vendorid)
                localStorage.setItem('vendorname', vendorname)
                localStorage.setItem('assoc_schools', JSON.stringify(venschoolids))
                navigate('/vendor/dashboard');
              })
              .catch (err => {
                console.error(err)
              })
              break;
          }
        }
      }
    } catch (error) {
      // Handle any post request errors
      console.error('Error:', error);
    }
  }

  return (
    <div className="maindiv">
      <CContainer>
        <CRow className="crow">
          <CCol md={8}>
            <CCardGroup className='ccardgrp'>
              <CCard className='ccard'><img src={BrandImage} alt="_brandlogo" /></CCard>
              <CCard className='ccard'>
                <CCardBody>
                  <CForm>
                    <h1 className='h1'>Log In</h1>
                    <p>
                      Welcome to Marsupium, your best friend when it comes to picking up your child after school
                    </p> 

                    <CInputGroup className="cinputgrp">
                      <CFormSelect 
                        id="inputGroupSelect01" 
                        value={usertype} 
                        onChange={(e) => setUsertype(e.target.value)}
                      >
                        <option value='sys-adm'>Log in as System Admin</option>
                        <option value='sch-adm'>Log in as School Admin</option>
                        <option value='ven'>Log in as Vendor</option>
                      </CFormSelect>
                    </CInputGroup>

                    <CInputGroup className="cinputgrp">
                      <CFormInput
                        id="userid"
                        placeholder="User ID"
                        autoComplete="userid"
                        value={userid}
                        onChange={(e) => setUserid(e.target.value)}
                      />
                    </CInputGroup>

                    <CInputGroup className="cinputgrp">
                      <CFormInput
                        id="password"
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>

                    <p className="p">Log in with the user id assigned to you by your administrator</p>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          className='cbtn'
                          onClick={handleLogin}
                        >
                          Let's start
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
}