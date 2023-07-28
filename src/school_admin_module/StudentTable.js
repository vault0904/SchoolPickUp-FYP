import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { cilPencil } from "@coreui/icons"
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CModal,
  CContainer,
  CForm,
  CFormLabel,
  CFormInput,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
} from '@coreui/react'
import '../css/defaultstyle.css';
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Typography,
  Tooltip,
  IconButton,
  Input,
} from '@material-tailwind/react'
import { TrashIcon } from "@heroicons/react/24/solid";

export default function StudentTable() {
  //  RETRIEVE CHILD DATA START  // 
  //
  // Define table header
  const TABLE_HEAD = ["USER ID", "FIRST NAME", "LAST NAME", "FORM CLASS","EMAIL", "ADDRESS", "PARENT ID", "", ""];

  // Declare hook, which will be used to set child data, after getting the data from API below
  const [tableData, setTableData] = useState([]);

  // Retrieve school ID from localstorage
  // So that we can use it to find all child related to the given school ID
  const school_ID = localStorage.getItem('schoolid');

  // API URL to get child data
  const API_GETCHILD = 'https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/schadm-getchild'

  // Axios post request, which we will get all child data related to the school
  useEffect(() => {
    axios.post(API_GETCHILD, {school_ID})
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
  //  RETRIEVE CHILD DATA END  //


  //  SEARCH BOX FUNCTION START  //
  //
    // Hooks for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;  // number of rows to display
    const startIndex = (currentPage - 1) * rowsPerPage;

    // Hook for search
    const [searchQuery, setSearchQuery] = useState('');
  //
  // SEARCH BOX FUNCTION END  //


// CREATE FUNCTION START //
//
  // Hook to toggle visibility of create student modal
  const [createModalVisible, setCreateModalVisible] = useState(false)

  // Hooks which will save the inputs in the create student modal,
  // The inputs will then be submitted to the post request API later
  const [ userId, setUserId ] = useState('');
  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState('');
  const [ formClass, setFormClass ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ address, setAddress ] = useState('');
  const [ parentId, setParentId ] = useState('');

  // Method to clear the create student inputs
  const handleClearForm = () => {
    setUserId('')
    setFirstName('')
    setLastName('')
    setFormClass('')
    setEmail('')
    setAddress('')
    setParentId('')
  };

  // API URL to post input submitted by user in create student modal
  const API_CREATECHILD = 'https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/schadm-createchild'

  // Handle create student
  const handleCreateChild = async () => {
    try {
      // Basic frontend validation first, before sending post request
      // If any of the input fields are are empty, do not proceed with axios post req. 
      if (!userId || !firstName || !lastName || !formClass || !email || !address || !parentId ) {
        alert('Fill in all fields first before creating the account')
        return;
      }
      
      // Else proceed with post request
      // Post the request to API
      const res = await axios.post(API_CREATECHILD, { userId, firstName, lastName, formClass, email, address, school_ID, parentId });

      // After API return a response
      // We check whether the response returned is True or False
      // Return True means API has successfully created the student acc in database
      // Return False means API did not create the student acc in database
      const apiresult = res.data;
      if (apiresult.success) {
        // Account successfully created
        alert('Account successfully created')
        handleClearForm();
        setCreateModalVisible(false);
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


//  UPDATE FUNCTION START  //
//
  // Variables that will be used in the update student modal
  // Note that updatedUserId hook is not declared and used here we are re-using userId hook that was created above
  // We are able to re-use based on the assumption that (the child ID is unique and cannot be changed once the account for it has been created)
  // Same assumption for parent ID
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updatedFirstname, setUpdatedFirstname] = useState('');
  const [updatedLastname, setUpdatedLastname] = useState('');
  const [updatedFormclass, setUpdatedFormclass] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedAddress, setUpdatedAddress] = useState('');

  // Hook to toggle visibility of update modal,
  // The update modal will be populated with selected row's student data
  const showUpdateModal = ( userid, firstname, lastname, formclass, email, address, parentid ) => {
    setUserId(userid);
    setUpdatedFirstname(firstname);
    setUpdatedLastname(lastname);
    setUpdatedFormclass(formclass);
    setUpdatedEmail(email);
    setUpdatedAddress(address);
    setParentId(parentid);
    setUpdateModalVisible(true);
  };

  // API URL to update student account
  const API_UPDATECHILD = 'https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/schadm-updatechild'
  
  // Handle updating driver details
  const handleUpdateChild = async () => {
    try {
      // Perform basic validation
      // Check that atleast 1 of the inputs are different from table row data before proceeding with update query in axios put
      // Find the specific row data based on the userid (which was set by state hook)
      const rowData = tableData.find(data => data.child_ID === userId);
      const isUpdated = updatedFirstname !== rowData.firstName || updatedLastname !== rowData.lastName || updatedFormclass !== rowData.formClass || updatedEmail !== rowData.email || updatedAddress !== rowData.address

      if (!isUpdated) {
        alert('No changes made. Change either the first name, last name, form class, email or address first before updating!');
        return;
      }

      // Perform the update API request using axios
      const res = await axios.put(API_UPDATECHILD, { 
        userId, updatedFirstname, updatedLastname, updatedFormclass, updatedEmail, updatedAddress
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







//  DELETE FUNCTION START  //
//
  // Hook to toggle visibility of delete student modal, and to store the user id that was selected by user
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState('');   

  // Show the delete confirmation modal
  // When user click on the delete button, they will trigger this const, and pass the user id in the parameter
  const showDeleteConfirmation = (userid) => {
    setDeleteModalVisible(true);
    // store user id, so that we can use it in the axios delete request body later should user confirm to delete
    setDeletingUserId(userid);
  };

  // API URL to delete student account
  const API_DELETECHILD = 'https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/schadm-deletechild'

  // Handle the deletion of an student account
  const handleDeleteChild = async () => {
    try {
      const res = await axios.delete(API_DELETECHILD, { data: { deletingUserId } });

      // After API returns a response
      // We check whether it returns True or False
      // We can manipulate the kind of response we want in API lambda, for now it is set as response is either True or False
      // Return True means student account has been successfully deleted
      // Return False means account was not deleted, view the errlog to find exact error
      const apiResult = res.data;
      if (apiResult.success) {
        // Announcement successfully deleted
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
    }
  };
//
//  DELETE FUNCTION END //

  // NAVIGATE TO UPLOAD STUDENT UI
  const navigate = useNavigate(); 
  const navigateToUploadstudent = async () => {
    navigate('/school-admin/uploadstudent')
  }


  return (
    <>
      <div className="flex justify-between items-center mb-4">
        {/* Title */}
        <p 
          className="font-bold mx-auto text-lg"
          style={{ fontSize: '20px', color: '#56844B', paddingLeft: '23%'}} 
        >
          Student User Accounts
        </p>

        {/* Upload Student Accounts Button */}
        <CButton 
          onClick={navigateToUploadstudent}
          style={{  
            '--cui-btn-color': 'white',
            '--cui-btn-bg': '#56844B',
            '--cui-btn-border-color': 'transparent',
            '--cui-btn-hover-bg': '#56844B',
            '--cui-btn-hover-border-color': '#56844B',
          }}
          className="px-2 py-2" 
        >
          Upload Students
        </CButton>
        
        {/* Create Student Account Button */}
        <div style={{marginLeft: '10px'}}>
          <CButton 
            onClick={() => setCreateModalVisible(!createModalVisible)}
            style={{  
              '--cui-btn-color': 'white',
              '--cui-btn-bg': '#56844B',
              '--cui-btn-border-color': 'transparent',
              '--cui-btn-hover-bg': '#56844B',
              '--cui-btn-hover-border-color': '#56844B',
            }}
            className="px-2 py-2"
          >
            Create Student
          </CButton>
        </div>

        {/* Create Student Account Modal */}
        <CModal scrollable visible={createModalVisible} onClose={() => setCreateModalVisible(false)} backdrop='static'>
          <CModalHeader>
            <CModalTitle style={{ color: '#56844B', fontWeight: 'bold', fontSize: '20px'}}>Create Student Account</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className='overflow-auto'>
              <CFormLabel>Creating student account for school</CFormLabel>
              <CFormInput 
                value={school_ID} 
                className='mb-2'
                disabled
              />
              <CFormLabel>User ID</CFormLabel>
              <CFormInput 
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className='mb-2'
              />
              <CFormLabel>First Name</CFormLabel>
              <CFormInput 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className='mb-2'
              />
              <CFormLabel>Last Name</CFormLabel>
              <CFormInput 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className='mb-2'
              />
              <CFormLabel>Form Class</CFormLabel>
              <CFormInput 
                value={formClass}
                onChange={(e) => setFormClass(e.target.value)}
                className='mb-2'
              />
              <CFormLabel>Email</CFormLabel>
              <CFormInput 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='mb-2'
              />
              <CFormLabel>Address</CFormLabel>
              <CFormInput 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className='mb-2'
              />
              <CFormLabel>Parent</CFormLabel>
              <CFormInput 
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className='mb-2'
              />
            </CForm>
          </CModalBody>
          <CModalFooter className="d-flex justify-content-center">
            <CButton 
              style ={{'background': '#56844B', width: '70%'}}
              onClick={handleCreateChild}
            >
              Create Student Account  
            </CButton>
            <CButton 
              color='light'
              style ={{ width: '70%'}}
              onClick={handleClearForm}
            >
              Clear Form
            </CButton>
          </CModalFooter>
        </CModal>
      </div>

      {/* Search box */}
      <div className='px-5 py-3'>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search student user ID"
        />
      </div>

      {/* Student Accounts Overview Table */}
      <Card className="overflow-scroll h-full w-full">
        <CardBody style={{ padding: 0 }}>
          {tableData.length === 0 ? (
            <Typography className="p-4">No student accounts</Typography>
          ) : (
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
                {tableData
                  .filter((row) => row.child_ID.toLowerCase().includes(searchQuery.toLowerCase()))  // .filter for real time search query
                  .slice(startIndex, startIndex + rowsPerPage)  // .slice for pagination
                  .map(( data, index ) => {
                  const isLast = index === data.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={data.child_ID}>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.child_ID}
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
                          {data.formClass}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.email}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.address}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.parent_ID}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <IconButton variant="text" color="blue-gray"
                          onClick={() => showUpdateModal(data.child_ID, data.firstName, data.lastName, data.formClass, data.email, data.address, data.parent_ID)}>
                          <CIcon icon={cilPencil} />
                        </IconButton>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Delete">
                          <IconButton variant="text" color="blue-gray" onClick={() => showDeleteConfirmation(data.child_ID)}>
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}

                {/* IMPORTANT NOTE, modal code should be placed outside of the table map function */}
                {/* Update student account modal */}
                <CModal scrollable visible={updateModalVisible} onClose={() => setUpdateModalVisible(false)} backdrop='static'>
                  <CModalHeader>
                    <CModalTitle style={{ color: '#56844B', fontWeight: 'bold', fontSize: '20px' }}>
                      Update Student Account
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
                      <CFormLabel>Form Class</CFormLabel>
                      <CFormInput
                        value={updatedFormclass}
                        onChange={(e) => setUpdatedFormclass(e.target.value)}
                        className="mb-2"
                      />
                      <CFormLabel>Email</CFormLabel>
                      <CFormInput
                        value={updatedEmail}
                        onChange={(e) => setUpdatedEmail(e.target.value)}
                        className="mb-2"
                      />
                      <CFormLabel>Address</CFormLabel>
                      <CFormInput
                        value={updatedAddress}
                        onChange={(e) => setUpdatedAddress(e.target.value)}
                        className="mb-2"
                      />
                      <CFormLabel>Parent ID</CFormLabel>
                      <CFormInput 
                        value={parentId} 
                        className="mb-2"
                        disabled 
                      />
                    </CForm>
                  </CModalBody>
                  <CModalFooter className="d-flex justify-content-center">
                    <CButton style={{ background: '#56844B', width: '70%' }} onClick={handleUpdateChild}>
                      Update
                    </CButton>
                    <CButton color="light" style={{ width: '70%' }} onClick={() => setUpdateModalVisible(false)}>
                      Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>

                {/* Delete confirmation modal */}
                <CModal scrollable visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
                  <CModalHeader>
                    <CModalTitle style={{ color: '#56844B', fontWeight: 'bold', fontSize: '20px' }}>
                      Confirm Deletion
                    </CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <p>Are you sure you want to delete this account?</p>
                  </CModalBody>
                  <CModalFooter>
                    <CButton onClick={handleDeleteChild} color="light">
                      Confirm
                    </CButton>
                    <CButton onClick={() => setDeleteModalVisible(false)} color="secondary">
                     Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>
              </tbody>
            </table>
          )}
        </CardBody>

        {/* Pagination for table */}
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Button 
            variant="outlined" color="blue-gray" 
            size="sm" disabled={currentPage === 1} 
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from(Array(Math.ceil(tableData.length / rowsPerPage)).keys()).map((page) => (
              <IconButton
                key={page + 1} variant={currentPage === page + 1 ? "outlined" : "text"}
                color="blue-gray" 
                size="sm"
                onClick={() => setCurrentPage(page + 1)}
              >
                {page + 1}
              </IconButton>
            ))}
          </div>
          <Button
            variant="outlined" color="blue-gray"
            size="sm" disabled={currentPage === Math.ceil(tableData.length / rowsPerPage)}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}