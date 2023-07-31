import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import axios from 'axios';
import { 
  Card, 
  CardHeader,
  CardBody,
  Typography,
  Tabs,
  TabPanel,
  Input,
  Button,
} from "@material-tailwind/react";
import '../css/defaultstyle.css'

export default function EditProfile() {
// RETRIEVE DETAILS START //
//
  // Retrieve user id and type from URL parameters
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const type = searchParams.get('type');

  // API to get back user details (id, f/l names, email)
  const API_GETPROFILEDETAILS = 'https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/webgetprofiledetails'

  // Declare state for the details we would be receiving
  // Store state as array
  const [ profileDetails, setProfileDetails ] = useState({
    id: '',
    vendor_Name: '',
    address: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // API
  useEffect(() => {
    axios.post(API_GETPROFILEDETAILS, {type, id})
      .then(res => {
        setProfileDetails(res.data);
      })
      .catch(err => {
        console.error(err);
      })
  }, [])
//
// RETRIEVE DETAILS END //



// EDIT DETAILS START //
//
  // States for Toggling editing mode
  const [ disableEdit, setDisableEdit ] = useState(true)
  const toggleEditMode = () => {
    if (type == "ven") {
      // We do not want vendor to change their official details randomly
      alert("Please contact Marsupium admin to change vendor details")  
      return
    } else {
      setDisableEdit(!disableEdit)
    }
  }

  // States for Edit profile details
  const [ editedFirstName, setEditedFirstName ] = useState('');
  const [ editedLastName, setEditedLastName ] = useState('');
  const [ editedEmail, setEditedEmail ] = useState('');

  // The entire point of this useEffect is to make the form show the previous value when the 'edit details' button is clicked, otherwise it would be empty since we declared it as empty ''
  useEffect(() => {
    setEditedFirstName(profileDetails.firstName);
    setEditedLastName(profileDetails.lastName);
    setEditedEmail(profileDetails.email);
  }, [profileDetails]);

  // Handle edits made by user
  const handleEdit = async () => {
    // Front end validation, check if input fields are different first
    if (editedFirstName == profileDetails.firstName && editedLastName == profileDetails.lastName && editedEmail == profileDetails.email ) {
      alert('No changes made')
      return
    } else {
      // Else proceed to post changes to API
      const API_EDITDETAILS = 'https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/webeditprofiledetails'

      axios.put(API_EDITDETAILS, { 
        type, 
        id: profileDetails.id, 
        editedFirstName, 
        editedLastName, 
        editedEmail, 
      })
      .then(res => {
        alert('Profile successfully updated')
        // 
        setDisableEdit(!disableEdit)
        window.location.reload();
      })
      .catch(err => {
        console.error(err);
      })
    }
  }

  // States for Change password
  const [ oldPassword, setOldPassword ] = useState('');
  const [ newPassword, setNewPassword ] = useState('');
  const [ newReEnterPassword, setNewReEnterPassword ] = useState('');

  // Clear password inputs
  const clearPasswordFields = () => {
    setOldPassword('');
    setNewPassword('');
    setNewReEnterPassword('');
  }

  const handleChangePassword = async () => {
    // Validation 1, check if user entered correct old pw
    if (oldPassword !== profileDetails.password) {
      alert('Wrong password')
      window.location.reload();
      return;
    } 
    // Validation 2, check if new password typed correct
    if (newPassword !== newReEnterPassword) {
      alert('You did not type your new password correctly')
      window.location.reload();
      return;
    } 

    // Proceed to send API to change pw
    const API_CHANGEPASSWORD = 'https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/webchangepassword'

    axios.put(API_CHANGEPASSWORD, {
     type,
     id: profileDetails.id,
     pw: newPassword, 
    })
    .then(res => {
      alert('Password updated successfully')
      clearPasswordFields();
      window.location.reload();
    })
    .catch(err => {
      console.error(err)
    })

  }
//
// EDIT DETAILS END //

  
  return (
    <>
      {/* https://www.material-tailwind.com/docs/react/form */}
      <Card className="w-full max-w-[24rem]">
        <CardHeader color="gray" floated={false} shadow={false} className="m-0 grid place-items-center rounded-b-none py-8 px-4 text-center" >
          <div className="mb-4 rounded-full border border-white/10 bg-white/10 p-6 text-white">
            S3
          </div>
          <Typography variant="h6" color="white">
            Edit profile picture
          </Typography>
        </CardHeader>
        <CardBody>
          <Tabs value="card" className="overflow-visible">
            <TabPanel value="card" className="p-0">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                  User ID
                </Typography>
                <Input disabled value={profileDetails.id}/>
              </div>
              {type == "ven" ? (
                  // Vendor's interface will show vendor name and address
                  <>
                    <div>
                      <Typography variant="small" color="blue-gray" className="mt-4 mb-2 font-medium">
                        Vendor Name
                      </Typography>
                      <Input disabled={disableEdit} value={profileDetails.vendor_Name} />
                    </div>
                    <div>
                      <Typography variant="small" color="blue-gray" className="mt-4 mb-2 font-medium">
                        Address
                      </Typography>
                      <Input disabled={disableEdit} value={profileDetails.address}/>
                    </div>
                  </>
                ) : (
                  // System or School admin's interface will show first last name 
                  <>
                    <div>
                      <Typography variant="small" color="blue-gray" className="mt-4 mb-2 font-medium">
                        First Name
                      </Typography>
                      <Input 
                        disabled={disableEdit} 
                        value={
                          disableEdit ? profileDetails.firstName : editedFirstName
                        }
                        onChange={(e) => setEditedFirstName(e.target.value)} />
                    </div>
                    <div>
                      <Typography variant="small" color="blue-gray" className="mt-4 mb-2 font-medium">
                        Last Name
                      </Typography>
                      <Input 
                        disabled={disableEdit} 
                        value={
                          disableEdit ? profileDetails.lastName : editedLastName
                        }
                        onChange={(e) => setEditedLastName(e.target.value)} />
                    </div>
                  </>
                )
              }
              <div>
                <Typography variant="small" color="blue-gray" className=" mt-4 mb-2 font-medium">
                  Email
                </Typography>
                <Input 
                  disabled={disableEdit} 
                  value={
                    disableEdit ? profileDetails.email : editedEmail
                  }
                  onChange={(e) => setEditedEmail(e.target.value)}
                  />
              </div>
              <div className="flex justify-between">
                <Button className="mt-4" style={{ 'width': '40%', 'backgroundColor': '#56844B' }} size="lg" onClick={toggleEditMode}>
                  {disableEdit ? 'Edit details': 'Cancel'}
                </Button>
                <Button className="mt-4" style={{ 'width': '40%', 'backgroundColor': '#56844B' }} size="lg" disabled={disableEdit} onClick={handleEdit}>Save changes</Button>
              </div>
            </TabPanel>
          </Tabs>
        </CardBody>
      </Card>

      <Card className="w-full max-w-[24rem] mt-5">
        <CardHeader color="gray" floated={false} shadow={false} className="m-0 grid place-items-center rounded-b-none py-8 px-4 text-center" value="cardheader">
          <Typography variant="h6" color="white">
            Change Password
          </Typography>
        </CardHeader>
        <CardBody>
          <Tabs value="card" className="overflow-visible">
            <TabPanel value="card" className="p-0">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                    Old password
                </Typography>
                <Input 
                  type='password'
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}/>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mt-4 mb-2 font-medium">
                    New password
                </Typography>
                <Input 
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}/>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mt-4 mb-2 font-medium">
                    Re-enter new password
                </Typography>
                <Input 
                  type='password'
                  value={newReEnterPassword}
                  onChange={(e) => setNewReEnterPassword(e.target.value)}/>
              </div>
              <div className="flex justify-between">
                <Button className="mt-4" style={{ 'width': '30%', 'backgroundColor': '#56844B' }} size="lg" onClick={handleChangePassword}>Change password</Button>
              </div>
            </TabPanel>
          </Tabs>
        </CardBody>
      </Card>
    </>
  )
}