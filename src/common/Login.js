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


export default function Login() {
  // Hooks for login form
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('sys-adm');  // Set default as 'sys-adm' because that is the first choice of the CFormSelect, and we are accounting for the situation that system admin did not touch the drop down box at all during login. If that scenario happens then default value 'sys-adm' will come into play when API request is sent
  const navigate = useNavigate(); 

  // API URL for login
  const API_WEBLOGIN = 'https://o92cl4kdw2.execute-api.ap-southeast-1.amazonaws.com/dev/api/weblogin';
  
  const handleLogin = async () => {
    try {
      const response = await fetch(API_WEBLOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userid: userid,
          password: password,
          usertype: usertype,
        })
      });
      
      if (response) {
        // Get response returned by API
        // Response returns either {success: true, userid: '123' usertype: 'sys-adm' etc} or {success: false}
        const data = await response.json();
        
        // If API returns false, meaning authentication failed
        if (!data.success) {
          // Inform user wrong login credentials
          alert('Wrong userid or password')
          window.location.reload(); 
        } else {
          // Else proceed to log user in to their dashboard
          // However before that, we store the relevant user details in local storage, such as their names, so that we can use it to display in their dashboard for example
          
          // Get usertype from API response, store in local storage
          const retrieve_usertype = data.usertype;
          localStorage.setItem('usertype', retrieve_usertype)

          switch (data.usertype) {
            case "sys-adm":
              // Retrieve relevant details from API response
              const retrieve_userid_sysadm = data.userid;
              const retrieve_fname_sysadm = data.firstName;
              const retrieve_lname_sysadm = data.lastName;
              // Store relevant details
              localStorage.setItem('userid', retrieve_userid_sysadm)
              localStorage.setItem('firstname', retrieve_fname_sysadm)
              localStorage.setItem('lastname', retrieve_lname_sysadm)
              // Navigate the user to their appropriate dashboard
              navigate('/system-admin/dashboard');
              break;

            case "sch-adm":
              // Retrieve relevant details from API response
              const retrieve_userid_schadm  = data.userid;
              const retrieve_fname_schadm = data.firstName;
              const retrieve_lname_schadm = data.lastName;
              const retrieve_schid_schadm = data.school_ID;
              // Store relevant details
              localStorage.setItem('userid', retrieve_userid_schadm)
              localStorage.setItem('firstname', retrieve_fname_schadm)
              localStorage.setItem('lastname', retrieve_lname_schadm)
              localStorage.setItem('schoolid', retrieve_schid_schadm)
              // Navigate the user to their appropriate dashboard
              navigate('/school-admin/dashboard');
              break;   

            case "bus-ven":
              // Retrieve relevant details from API response
              const retrieve_userid_busven  = data.userid;
              const retrieve_vendorname_busven = data.vendor_Name;
              const retrieve_schoolID_busven = data.school_ID;
              // Store relevant details
              localStorage.setItem('userid', retrieve_userid_busven)
              localStorage.setItem('vendorname', retrieve_vendorname_busven)
              localStorage.setItem('school_ID_associated', retrieve_schoolID_busven)
              // Navigate the user to their appropriate dashboard
              navigate('/bus-vendor/dashboard');
              break;       
          }  
        }
      }
    } catch (error) {
      // Handle any post request errors
      console.error('Error:', error);
    }
  };

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
                        <option value='bus-ven'>Log in as Bus Vendor</option>
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