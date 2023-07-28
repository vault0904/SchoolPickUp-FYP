import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  CFormTextarea,
} from "@coreui/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import CIcon from '@coreui/icons-react';
import { cilPencil } from "@coreui/icons";
import '../css/defaultstyle.css';
import { useNavigate } from 'react-router';

export default function AnnouncementTable() {  
// RETRIEVE ANNOUNCEMENTS START //
  // Define table header
  const TABLE_HEAD = ["POST ID", "MESSAGE", "POSTED BY", "LAST UPDATED", "DATE POSTED", "", ""];

  // Declare hook, which will be used to set announcement data, after getting the data from API below
  const [tableData, setTableData] = useState([]);

  // Retrieve school ID from localstorage, which should be set right before school admin successfully logs into the website
  const school_ID = localStorage.getItem('schoolid');

  // API URL to get announcement data
  const API_GETSCHANNOUNCEMENT = 'https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/schadm-getschoolannouncement'

  // Axios post request, which we will get all announcement data
  useEffect(() => {
    axios.post(API_GETSCHANNOUNCEMENT, {school_ID})
      .then(res => {
        // Set in the hook declared earlier
        // We can now use the tableData.map function to map out the data
        setTableData(res.data)
      })
      .catch(err => {
        console.error(err);
      })
  }, []);
// RETRIEVE ANNOUNCEMENTS END //


// CREATE FUNCTION START //
  // Hook to toggle visibility of create announcement modal
  const [visible, setVisible] = useState(false)

  // Hooks which will save the inputs in the create announcement modal,
  // The inputs will then be submitted to the post request API later
  const [message, setMessage] = useState('');

  // Get today's date, then format it to the correct format for MySQL (YYYY-MM-DD)
  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toISOString().toLocaleString();

  // Method to clear the create announcement inputs
  const handleClearForm = () => {
    setMessage('');
  };

  // API URL to post input submitted by user in create announcement modal
  const API_CREATEANNOUNCEMENT = 'https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/schadm-createannouncement'

  // 
  const handleCreateAnnouncement = async () => {
    try {
      // Basic frontend validation first, before sending post request
      // If message is empty, do not proceed with axios post req. 
      if (!message) {
        alert('Announcement message is empty! Write your message before posting')
        return;
      }
      // Else proceed with post request, 
      // Retrieve school admin ID from localstorage first so that can fulfil post request
      // school_ID was retrieved previously, so we can use it again in the post request body below
      const schooladmin_ID = localStorage.getItem('userid')

      // Post the request to API
      // Body contains the message, formatted current date, school id and sch admin id
      const res = await axios.post(API_CREATEANNOUNCEMENT, { message, formattedCurrentDate, school_ID, schooladmin_ID });

      // After API return a response
      // We check whether the response returned is True or False
      // Return True means API has successfully created the announcement in database
      // Return False means API did not create the announcement in database
      const apiresult = res.data;
      if (apiresult.success) {
        // Announcement successfully created
        alert('Announcement successfully created')
        handleClearForm();
        setVisible(false);
        window.location.reload();
      } else {
        // Announcement was not created, 
        // See the exact error in errlog, whether its error from query or stopped by validation that is in lambda function
        alert(apiresult.errlog);
      }
    } catch (err) {
      console.error(err);
    }
  };
// CREATE FUNCTION END //


//  VIEW FUNCTION //
  const [ viewModalVisible, setViewModalVisible ] = useState(false);
  const [ viewMessage, setViewMessage ] = useState('');

  const handleViewAnnouncement = ( message ) => {
    setViewMessage(message);
    setViewModalVisible(true);
  };
// VIEW FUNCTION END //


//  UPDATE FUNCTION START  //
  // Variables that will be used in the update modal
  const [ updateModalVisible, setUpdateModalVisible ] = useState(false);
  const [ postId, setPostId ] = useState('');
  const [ updateMessage, setUpdateMessage ] = useState('');

  // Hook to toggle visibility of update modal,
  // The update modal will be populated with selected row's announcement message
  const showUpdateModal = ( postid, message ) => {
    setPostId(postid);
    setUpdateMessage(message);
    setUpdateModalVisible(true);
  };

  // API URL to update announcement message
  const API_UPDATEANNOUNCEMENT = 'https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/schadm-updateannouncement'
  
  // Handle updating announcement message
  const handleUpdateAnnouncement = async () => {
    try {
      // Perform basic validation
      // Check that atleast message inputs are different from table row data before proceeding with update query in axios put
      // Find the specific row data based on the postid (which was set by state hook)
      const rowData = tableData.find(data => data.post_ID === postId);
      const isUpdated = updateMessage !== rowData.message;

      if (!isUpdated) {
        alert('No changes made. Change the message first before updating');
        return;
      }

      // Perform the update API request using axios
      const res = await axios.put(API_UPDATEANNOUNCEMENT, {
        postid: postId, 
        updatemessage: updateMessage, 
        formattedCurrentDate: formattedCurrentDate,
      });
  
      // Handle the response
      const apiResult = res.data;
      if (apiResult.success) {
        // Announcement message succesfully updated
        alert('Announcement message successfully updated');
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
// UPDATE FUNCTION END  //


//  DELETE FUNCTION START  //
  // Hook to toggle visibility of delete announcement modal, and to store the post id that was selected by user
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState('');   

  // Show the delete confirmation modal
  // When user click on the delete button, they will trigger this const, and pass the post id in the parameter
  const showDeleteConfirmation = (postid) => {
    setDeleteModalVisible(true);
    // store driver id, so that we can use it in the axios delete request body later should user confirm to delete
    setDeletingPostId(postid);
  };

  // API URL to delete announcement
  const API_DELETEANNOUNCEMENT = 'https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/schadm-deleteannouncement'

  // Handle the deletion of an announcement
  const handleDeleteAnnouncement = async () => {
    try {
      const res = await axios.delete(API_DELETEANNOUNCEMENT, { data: { deletingPostId } });

      // After API returns a response
      // We check whether it returns True or False
      // We can manipulate the kind of response we want in API lambda, for now it is set as response is either True or False
      // Return True means announcement has been successfully deleted
      // Return False means announcement was not deleted, view the errlog to find exact error
      const apiResult = res.data;
      if (apiResult.success) {
        // Announcement successfully deleted
        alert('Announcement successfully deleted');
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
// DELETE FUNCTION END //

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p 
          className="font-bold mx-auto text-lg"
          style={{ fontSize: '20px', color: '#56844B', paddingLeft: '5%'}} >
          School Announcements
        </p>

        {/* Create announcement button */}
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
          Create Announcement
        </CButton>

        {/* Create announcement modal */}
        <CModal scrollable visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle style={{ color: '#56844B', fontWeight: 'bold', fontSize: '20px'}}>Create Announcement</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {/* https://coreui.io/react/docs/forms/form-control/ */}
            <CForm className='overflow-auto'>
              <CFormLabel>Announcement message</CFormLabel>
              <CFormTextarea
                rows={15}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className='mb-2'
              />
              <CFormLabel>Date</CFormLabel>
              <CFormInput 
                value={formattedCurrentDate} 
                className='mb-2'
                disabled
              />
            </CForm>
          </CModalBody>
          <CModalFooter className="d-flex justify-content-center">
            <CButton 
              style ={{'background': '#56844B', width: '70%'}}
              onClick={handleCreateAnnouncement}>
              Post
            </CButton>
          </CModalFooter>
        </CModal>
      </div>

      <Card className="overflow-scroll h-full w-full">
        <CardBody style={{ padding: 0 }}>
          {tableData.length === 0 ? (
            <Typography className="p-4">No announcement posted</Typography>
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
                {tableData.map(( data, index ) => {
                  const isLast = index === data.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={data.post_ID}>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.post_ID}
                        </Typography>
                      </td>
                      <td className={classes}>    
                        <Typography 
                          variant="small" 
                          color="blue-gray" 
                          className="font-normal w-screen h-32 overflow-hidden"
                          onClick={() => handleViewAnnouncement(data.message)}>
                          {data.message}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.schAdmin_ID}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {/* Check if lastUpdated is null or not, because it is null by default until the school admin updates the message */}
                          {/* Returns Empty string if null (to prevent prop type warning) */}
                          {data.lastUpdated ? data.lastUpdated : ''}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.datePosted}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <IconButton variant="text" color="blue-gray"
                          onClick={() => showUpdateModal(data.post_ID, data.message)}>
                          <CIcon icon={cilPencil} />
                        </IconButton>
                      </td>

                      <td className={classes}>
                        <Tooltip content="Delete">
                          <IconButton variant="text" color="blue-gray" onClick={() => showDeleteConfirmation(data.post_ID)}>
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}

                {/* IMPORTANT NOTE, modal code should be placed outside of the table map function */}
                {/* View announcement modal */}
                <CModal 
                  backdrop='static' 
                  scrollable 
                  visible={viewModalVisible} 
                  onClose={() => setViewModalVisible(false)}>
                <CModalHeader>
                  <CModalTitle style={{ color: '#56844B', fontWeight: 'bold', fontSize: '20px' }}>
                    Announcement
                  </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CForm>
                    <CFormLabel>Announcement message:</CFormLabel>
                    <CFormTextarea
                      rows={15}
                      value={viewMessage}
                      className="mb-2"
                    />
                  </CForm>
                </CModalBody>
                </CModal>

                {/* Update announcement message modal */}
                <CModal backdrop='static' scrollable visible={updateModalVisible} onClose={() => setUpdateModalVisible(false)}>
                  <CModalHeader>
                    <CModalTitle style={{ color: '#56844B', fontWeight: 'bold', fontSize: '20px' }}>
                      Update Announcement
                    </CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CForm>
                      <CFormLabel>Announcement message:</CFormLabel>
                      <CFormTextarea
                        rows={15}
                        value={updateMessage}
                        onChange={(e) => setUpdateMessage(e.target.value)}
                        className="mb-2"
                      />
                    </CForm>
                  </CModalBody>
                  <CModalFooter className="d-flex justify-content-center">
                    <CButton style={{ background: '#56844B', width: '70%' }} onClick={handleUpdateAnnouncement}>
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
                    <p>Are you sure you want to delete this announcement?</p>
                  </CModalBody>
                  <CModalFooter>
                    <CButton onClick={handleDeleteAnnouncement} color="light">
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
      </Card>
    </>
  );
}