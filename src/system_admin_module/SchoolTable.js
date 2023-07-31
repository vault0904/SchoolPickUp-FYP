import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Card, 
  CardBody, 
  Typography, 
  Tooltip, 
  IconButton,
} from "@material-tailwind/react";
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CForm, CFormLabel, CFormInput } from '@coreui/react';
import { TrashIcon } from "@heroicons/react/24/solid";
import '../css/defaultstyle.css';
import ConfirmationModal from './ConfirmationModal';

export default function SchoolTable() {

  //  VIEW FUNCTION START  //
  // Define table header here
  const TABLE_HEAD = ["SCHOOL ID", "SCHOOL NAME", "SCHOOL ADDRESS", "CONTACT NO", "SCHOOL TYPE", "", ""];

  const [tableData, setTableData] = useState([]);

  // Axios get request to get all school data from db
  useEffect(() => {
    axios.get('https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/sysadm-getschool')
      .then(res => {
        setTableData(res.data)
      })
      .catch(err => {
        console.error(err);
      })
  }, []);

  // Navigate hook, is used when user clicks on 'view school admin'
  const navigate = useNavigate(); 
  const handleViewSchoolAdmins = (school_ID) => {
    navigate(`/system-admin/school/viewadmins?school_ID=${school_ID}`);
  };
  //  VIEW FUNCTION END  //


  // CREATE FUNCTION START //
  const [visible, setVisible] = useState(false)
  const [schoolId, setSchoolId] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [address, setAddress] = useState('')
  const [contactNo, setContactNo] = useState('')
  const [type, setType] = useState('')

  const handleClearForm = () => {
    setSchoolId('')
    setSchoolName('')
    setAddress('')
    setContactNo('')
    setType('')
  }

  const handleCreateSchool = async () => {
    try {
      // basic validation check for empty inputs
      if (!schoolId || !schoolName || !address || !contactNo || !type) {
        alert('Fill in all fields first')
        return;
      }

      const res = await axios.post('https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/sysadm-createschool', { 
        si: schoolId,
        sn: schoolName,
        a: address,
        cn: contactNo,
        t: type,
      });
      
      const apiresult = res.data;
      if (apiresult.success) {
        // School successfully created
        alert('School successfully created')
        handleClearForm();
        window.location.reload();
      } else {
        alert(apiresult.errlog);
      }
    } catch(err) {
      console.error(err)
    }
  }
  // CREATE FUNCTION END //


  //  DELETE FUNCTION START //
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingSchoolId, setDeletingSchoolId] = useState('');  

  const showDeleteConfirmation = (schoolid) => {
    setDeleteModalVisible(true);
    setDeletingSchoolId(schoolid);
  };

  const handleDeleteSchool = async () => {
    try {
      const res = await axios.delete('https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/sysadm-deleteschool', { data: { deletingSchoolId } });

      const apiResult = res.data;
      if (apiResult.success) {
        // School successfully deleted
        alert('School successfully deleted');
        window.location.reload();
      } else {
        alert(apiResult.errlog);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteModalVisible(false);
    }
  }
  // DELETE FUNCTION END  //

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p 
          className="font-bold mx-auto text-lg"
          style={{ fontSize: '20px', color: '#56844B', paddingLeft: '5%'}} >
          School Account Management
        </p>

          {/* Create school button */}
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
          Create School
        </CButton>

        {/* Create school modal */}
        <CModal scrollable visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle style={{ color: '#56844B', fontWeight: 'bold', fontSize: '20px'}}>Create School</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className='overflow-auto'>

              <CFormLabel>School ID</CFormLabel>
              <CFormInput 
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                className='mb-2'
              />
              <CFormLabel>School Name</CFormLabel>
              <CFormInput 
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className='mb-2'
              />
              <CFormLabel>Address</CFormLabel>
              <CFormInput 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className='mb-2'
              />
              <CFormLabel>Contact No</CFormLabel>
              <CFormInput 
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                className='mb-2'
              />
              <CFormLabel>School Type</CFormLabel>
              <CFormInput 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className='mb-2'
              />
            </CForm>
          </CModalBody>
          <CModalFooter className="d-flex justify-content-center">
            <CButton 
              style ={{'background': '#56844B', width: '70%'}}
              onClick={handleCreateSchool}>
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
                  <tr key={data.school_ID}>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {data.school_ID}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {data.school_Name}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {data.address}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {data.contactNo}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {data.type}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography as="a" variant="small" color="blue" className="font-medium" 
                        onClick={() => handleViewSchoolAdmins(data.school_ID)} >
                        View school admins
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Delete">
                        <IconButton variant="text" color="blue-gray" onClick={() => showDeleteConfirmation(data.school_ID)}>
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
              
              {/* IMPORTANT NOTE, modal code should be placed outside of the table map function */}
              {/* Delete confirmation modal */}
              <ConfirmationModal
                visible={deleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                onConfirm={handleDeleteSchool}
                callingComponent="SchoolTable"
              />
            </tbody>
          </table>
        </CardBody>
      </Card>
    </>
  )
}