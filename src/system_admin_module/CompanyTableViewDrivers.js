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
import ConfirmationModal from './ConfirmationModal';

export default function CompanyTableViewDrivers() {  
// RETRIEVE DRIVER DATA START //
//
  // Define table header
  const TABLE_HEAD = ["DRIVER ID", "FIRST NAME", "LAST NAME", "EMAIL", "LICENSE", "", ""];

  // Declare hook, which will be used to set driver data, after getting the data from API below
  const [tableData, setTableData] = useState([]);

  // Hooks to get the vendor_ID, from website URL, to include in API post request body
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const vendor_ID = searchParams.get('vendor_ID');

  // API URL to get driver data
  const API_GETDRIVER = 'https://o92cl4kdw2.execute-api.ap-southeast-1.amazonaws.com/dev/api/sysadm-getdrivers'

  // Axios post request, which we will get all driver data
  useEffect(() => {
    axios.post(API_GETDRIVER, {vendor_ID})
      .then(res => {
        // Set in the hook declared earlier
        // We can now use the tableData.map function to map out the data
        setTableData(res.data)
      })
      .catch(err => {
        console.error(err);
      })
  }, []);
//
// RETRIEVE DRIVER DATA END //






// CREATE FUNCTION START //
//
  // Hook to toggle visibility of create driver modal
  const [visible, setVisible] = useState(false)

  // Hooks which will save the inputs in the create driver modal,
  // The inputs will then be submitted to the post request API later
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [license, setLicense] = useState('');

  // Method to clear the create driver modal inputs
  const handleClearForm = () => {
    setUserid('');
    setPassword('');
    setFirstname('');
    setLastname('');
    setEmail('');
    setLicense('');
  };

  // API URL to post input submitted by user in create driver modal
  const API_CREATEDRIVER = 'https://o92cl4kdw2.execute-api.ap-southeast-1.amazonaws.com/dev/api/sysadm-createdriver'

  // 
  const handleCreateDriver = async () => {
    try {
      // Basic frontend validation first, before sending post request
      // If either userid, password, firstname, lastname or email is empty, do not proceed with axios post req. 
      if (!userid || !password || !firstname || !lastname || !email || !license) {
        alert('Fill in all fields first')
        return;
      }
      // Else proceed with post request, 
      // Post request body contains the inputs by the user + the vendor ID
      const res = await axios.post(API_CREATEDRIVER, { userid, password, firstname, lastname, email, license, vendor_ID });

      // After API return a response
      // We check whether the response returned is True or False
      // Return True means API has successfully created the account in database
      // Return False means API did not create the account in database
      const apiresult = res.data;
      if (apiresult.success) {
        // Account successfully created
        alert('Account successfully created')
        handleClearForm();
        window.location.reload();
      } else {
        // Account was not created, 
        // See the exact error in errlog, whether its error from query or stopped by validation that is in lambda function
        alert(apiresult.errlog);
      }
    } catch (err) {
      console.error(err);
    }
  };
//
// CREATE FUNCTION END //





//  DELETE FUNCTION START  //
//
  // Hook to toggle visibility of delete driver account modal, and to store the driver id that was selected by user
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState('');   

  // Show the delete confirmation modal
  // When user click on the delete button, they will trigger this const, and pass the driver ID in the parameter
  const showDeleteConfirmation = (userid) => {
    setDeleteModalVisible(true);
    // store driver id, so that we can use it in the axios delete request body later should user confirm to delete
    setDeletingUserId(userid);
  };

  // API URL to delete driver account
  const API_DELETEDRIVER = 'https://o92cl4kdw2.execute-api.ap-southeast-1.amazonaws.com/dev/api/sysadm-deletedriver'

  // Handle the deletion of an driver
  // This const will be triggered when a user clicks on the confirm button in ConfirmationModal.js (it has the attribute 'onClick={onConfirm}')
  // which will then trigger the 'onConfirm={handleDeleteDriver}' in our code below, 
  const handleDeleteDriver = async () => {
    try {
      const res = await axios.delete(API_DELETEDRIVER, { data: { deletingUserId } });

      // After API returns a response
      // We check whether it returns True or False
      // We can manipulate the kind of response we want in API lambda, for now it is set as response is either True or False
      // Return True means driver account has been successfully deleted
      // Return False means account was not deleted, view the errlog to find exact error
      const apiResult = res.data;
      if (apiResult.success) {
        // Account successfully deleted
        alert('Account successfully deleted');
        window.location.reload();
      } else {
        // View error
        alert(apiResult.errlog);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteModalVisible(false);
      // refresh page
      window.location.reload();
    }
  };
//
//  DELETE FUNCTION END //





//  UPDATE FUNCTION START  //
//
  // Variables that will be used in the update modal
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [userId, setUserId] = useState('');
  const [updatedFirstname, setUpdatedFirstname] = useState('');
  const [updatedLastname, setUpdatedLastname] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedLicense, setUpdatedLicense] = useState('');

  // Hook to toggle visibility of update modal,
  // The update modal will be populated with selected row's data
  const showUpdateModal = ( userid, firstname, lastname, email, license) => {
    setUserId(userid);
    setUpdatedFirstname(firstname);
    setUpdatedLastname(lastname);
    setUpdatedEmail(email);
    setUpdatedLicense(license);
    setUpdateModalVisible(true);
  };

  // API URL to update driver account
  const API_UPDATEDRIVER = 'https://o92cl4kdw2.execute-api.ap-southeast-1.amazonaws.com/dev/api/sysadm-updatedriver'
  
  // Handle updating driver details
  const handleUpdateDriver = async () => {
    try {
      // Perform basic validation
      // Check that atleast firstname,lastname, email or license inputs are different from table row data before proceeding with update query in axios put
      // Find the specific row data based on the userId (which was set by state hook)
      const rowData = tableData.find(data => data.driver_ID === userId);
      const isUpdated = updatedFirstname !== rowData.firstName || updatedLastname !== rowData.lastName || updatedEmail !== rowData.email || updatedLicense !== rowData.license;

      if (!isUpdated) {
        alert('No changes made. Change either the first name, last name, email or license first before updating');
        return;
      }

      // Perform the update API request using axios
      const res = await axios.put(API_UPDATEDRIVER, {
        userid: userId,
        updatedfirstname: updatedFirstname,
        updatedlastname: updatedLastname,
        updatedemail: updatedEmail,
        updatedlicense: updatedLicense,
      });
  
      // Handle the response
      const apiResult = res.data;
      if (apiResult.success) {
        // Account successfully updated
        alert('Account successfully updated');
        // Close the update modal
        setUpdateModalVisible(false);
        window.location.reload();
      } else {
        // View error
        alert(apiResult.errlog);
      }
    } catch (err) {
      console.error(err);
    }
  };
//
// UPDATE FUNCTION END  //

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p 
          className="font-bold mx-auto text-lg"
          style={{ fontSize: '20px', color: '#56844B', paddingLeft: '5%'}} >
          Driver Account Management
        </p>

        {/* Create driver button */}
        <CButton 
          onClick={() => setVisible(!visible)}
          style={{
            '--cui-btn-color': 'white',
            '--cui-btn-bg': '#56844B',
            '--cui-btn-border-color': 'transparent',
            '--cui-btn-hover-bg': '#56844B',
            '--cui-btn-hover-border-color': '#56844B',
          }}
          className="px-5 py-2" >
          Create Driver
        </CButton>

        {/* Create driver modal */}
        <CModal scrollable visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle style={{ color: '#56844B', fontWeight: 'bold', fontSize: '20px'}}>Create Driver Account</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className='overflow-auto'>
              <CFormLabel>Creating driver account for vendor ID</CFormLabel>
              <CFormInput 
                value={vendor_ID.toString()} 
                disabled
                className='mb-2'
              />

              <CFormLabel>User ID</CFormLabel>
              <CFormInput 
                value={userid}
                onChange={(e) => setUserid(e.target.value)}
                className='mb-2'
              />
              <CFormLabel>Password</CFormLabel>
              <CFormInput 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='mb-2'
              />
              <CFormLabel>First Name</CFormLabel>
              <CFormInput 
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className='mb-2'
              />
              <CFormLabel>Last Name</CFormLabel>
              <CFormInput 
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className='mb-2'
              />
              <CFormLabel>Email</CFormLabel>
              <CFormInput 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='mb-2'
              />
              <CFormLabel>License</CFormLabel>
              <CFormInput 
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className='mb-2'
              />
            </CForm>
          </CModalBody>
          <CModalFooter className="d-flex justify-content-center">
            <CButton 
              style ={{'background': '#56844B', width: '70%'}}
              onClick={handleCreateDriver}>
              Create
            </CButton>
            <CButton 
              color='light'
              style ={{ width: '70%'}}
              onClick={handleClearForm}>
              Clear Form
            </CButton>
          </CModalFooter>
        </CModal>
      </div>

      <Card className="overflow-scroll h-full w-full">
        <CardBody style={{ padding: 0 }}>
          {tableData.length === 0 ? 
          (
            <Typography className="p-4">
              No driver account with this vendor
            </Typography>
          ) 
          : 
          (
            <table className="w-full min-w-max table-auto text-left">
              <thead className="bg-gray-200">
                <tr>
                  {TABLE_HEAD.map((head, idx) => (
                    <th key={`${head}-${idx}`} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        color="black"
                        className="font-normal leading-none opacity-80">
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map(( data, index ) => {
                  const isLast = index === data.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={data.driver_ID}>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.driver_ID}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.firstName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.lastName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.email}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.license}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <IconButton variant="text" color="blue-gray"
                          onClick={() => showUpdateModal(data.driver_ID, data.firstName, data.lastName, data.email, data.license)}>
                          <CIcon icon={cilPencil} />
                        </IconButton>
                      </td>

                      <td className={classes}>
                        <Tooltip content="Delete">
                          <IconButton variant="text" color="blue-gray" onClick={() => showDeleteConfirmation(data.driver_ID)}>
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}

                {/* IMPORTANT NOTE, modal code should be placed outside of the table map function */}
                {/* Update driver modal */}
                <CModal backdrop='static' scrollable visible={updateModalVisible} onClose={() => setUpdateModalVisible(false)}>
                  <CModalHeader>
                    <CModalTitle style={{ color: '#56844B', fontWeight: 'bold', fontSize: '20px' }}>
                      Update Driver Account
                    </CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CForm className="overflow-auto">
                      <CFormLabel>User ID</CFormLabel>
                      <CFormInput 
                        value={userId} 
                        className="mb-2"
                        disabled 
                      />
                      <CFormLabel>First Name</CFormLabel>
                      <CFormInput
                        value={updatedFirstname}
                        onChange={(e) => setUpdatedFirstname(e.target.value)}
                        className="mb-2"
                      />
                      <CFormLabel>Last Name</CFormLabel>
                      <CFormInput
                        value={updatedLastname}
                        onChange={(e) => setUpdatedLastname(e.target.value)}
                        className="mb-2"
                      />
                      <CFormLabel>Email</CFormLabel>
                      <CFormInput
                        value={updatedEmail}
                        onChange={(e) => setUpdatedEmail(e.target.value)}
                        className="mb-2"
                      />
                      <CFormLabel>License</CFormLabel>
                      <CFormInput
                        value={updatedLicense}
                        onChange={(e) => setUpdatedLicense(e.target.value)}
                        className="mb-2"
                      />                      
                    </CForm>
                  </CModalBody>
                  <CModalFooter className="d-flex justify-content-center">
                    <CButton style={{ background: '#56844B', width: '70%' }} onClick={handleUpdateDriver}>
                      Update
                    </CButton>
                    <CButton color="light" style={{ width: '70%' }} onClick={() => setUpdateModalVisible(false)}>
                      Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>

                {/* Delete confirmation modal */}
                <ConfirmationModal
                  visible={deleteModalVisible}
                  onClose={() => setDeleteModalVisible(false)}
                  onConfirm={handleDeleteDriver}
                  callingComponent="CompanyTableViewDrivers"
                />
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </>
  );
}