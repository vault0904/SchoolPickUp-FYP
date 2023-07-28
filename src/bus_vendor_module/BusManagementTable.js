import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router';

export default function BusManagementTable() {
  //  RETRIEVE VEHICLE DATA START  //
  //
  // Define table header
  const TABLE_HEAD = ["VEHICLE PLATE", "VEHICLE TYPE", "CAPACITY", "", ""];

  // Declare hook, which will be used to set vehicle data, after getting the data from API below
  const [tableData, setTableData] = useState([]);

  // Retrieve vendor ID from localstorage
  // So that we can use it to find all vehicle related to the vendor
  const vendor_ID = localStorage.getItem('userid');

  // API URL to get vehicle data
  const API_GETVEHICLE = 'https://o92cl4kdw2.execute-api.ap-southeast-1.amazonaws.com/dev/api/busven-getvehicle'

  // Axios post request, which we will get all announcement data
  useEffect(() => {
    axios.post(API_GETVEHICLE, {vendor_ID})
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
  //  RETRIEVE VEHICLE DATA END  //


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
  // Hook to toggle visibility of create vehicle modal
  const [createModalVisible, setCreateModalVisible] = useState(false)

  // Hooks which will save the inputs in the create vehicle modal,
  // The inputs will then be submitted to the post request API later
  const [ vehiclePlate, setVehicleplate ] = useState('');
  const [ vehicleType, setVehicletype ] = useState('');
  const [ capacity, setCapacity ] = useState('');

  // Method to clear the create vehicle inputs
  const handleClearForm = () => {
    setVehicleplate('')
    setVehicletype('')
    setCapacity('')
  };

  // API URL to post input submitted by user in create vehicle modal
  const API_CREATEVEHICLE = 'https://o92cl4kdw2.execute-api.ap-southeast-1.amazonaws.com/dev/api/busven-createvehicle'

  // Handle create vehicle
  const handleCreateVehicle = async () => {
    try {
      // Basic frontend validation first, before sending post request
      // If any of the input fields are are empty, do not proceed with axios post req. 
      if (!vehiclePlate || !vehicleType || !capacity) {
        alert('Fill in all fields first before creating the vehicle')
        return;
      }
      
      // Else proceed with post request
      // Post the request to API
      const res = await axios.post(API_CREATEVEHICLE, { vehiclePlate, vehicleType, capacity, vendor_ID });

      // After API return a response
      // We check whether the response returned is True or False
      // Return True means API has successfully created the vehicle in database
      // Return False means API did not create the vehicle acc in database
      const apiresult = res.data;
      if (apiresult.success) {
        // Vehicle successfully created
        alert('Vehicle successfully created')
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
  // Variables that will be used in the update vehicle modal
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updatedVehicletype, setUpdatedVehicletype] = useState('');
  const [updatedCapacity, setUpdatedCapacity] = useState('');

  // Hook to toggle visibility of update modal,
  // The update modal will be populated with selected row's vehicle data
  const showUpdateModal = ( vehicleplate, vehicletype, capacity ) => {
    setVehicleplate(vehicleplate)
    setUpdatedVehicletype(vehicletype)
    setUpdatedCapacity(capacity)
    setUpdateModalVisible(true);
  };

  // API URL to update vehicle
  const API_UPDATEVEHICLE = 'https://o92cl4kdw2.execute-api.ap-southeast-1.amazonaws.com/dev/api/busven-updatevehicle'
  
  // Handle updating vehicle details
  const handleUpdateVehicle = async () => {
    try {
      // Perform basic validation
      // Check that atleast inputs are different from table row data before proceeding with update query in axios put
      // Find the specific row data based on the vehicle plate (which was set by state hook)
      const rowData = tableData.find(data => data.vehicle_plate === vehiclePlate);
      const isUpdated = updatedVehicletype !== rowData.vehicleType || updatedCapacity !== rowData.capacity;

      if (!isUpdated) {
        alert('No changes made. Change either the vehicle type or capacity first before updating');
        return;
      }

      // Perform the update API request using axios
      const res = await axios.put(API_UPDATEVEHICLE, {  
        vehiclePlate, updatedVehicletype, updatedCapacity
      });
  
      // Handle the response
      const apiResult = res.data;
      if (apiResult.success) {
        // Vehicle successfully updated
        alert('Vehicle successfully updated');
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
  // Hook to toggle visibility of delete vehicle modal, and to store the vehicle plate that was selected by user
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingVehicleplate, setDeletingVehicleplate] = useState('');   

  // Show the delete confirmation modal
  // When user click on the delete button, they will trigger this const, and pass the user id in the parameter
  const showDeleteConfirmation = (vehicleplate) => {
    setDeleteModalVisible(true);
    // store vehicle plate, so that we can use it in the axios delete request body later should user confirm to delete
    setDeletingVehicleplate(vehicleplate);
  };

  // API URL to delete vehicle
  const API_DELETEVEHICLE = 'https://o92cl4kdw2.execute-api.ap-southeast-1.amazonaws.com/dev/api/busven-deletevehicle'

  // Handle the deletion of an vehicle account
  const handleDeleteVehicle = async () => {
    try {
      const res = await axios.delete(API_DELETEVEHICLE, { data: { deletingVehicleplate } });

      // After API returns a response
      // We check whether it returns True or False
      // We can manipulate the kind of response we want in API lambda, for now it is set as response is either True or False
      // Return True means vehicle has been successfully deleted
      // Return False means vehicle was not deleted, view the errlog to find exact error
      const apiResult = res.data;
      if (apiResult.success) {
        // Vehicle successfully deleted
        alert('Vehicle successfully deleted');
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

  // UPLOAD BUTTON NAVIGATION //
  const navigate = useNavigate('')
  const navigateToUploadVehicle = () => {
    navigate('/bus-vendor/uploadvehicle')
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        {/* Title */}
        <p 
          className="font-bold mx-auto text-lg"
          style={{ fontSize: '20px', color: '#56844B', paddingLeft: '23%'}} 
        >
          Vehicle Management
        </p>

        {/* Upload Vehicle Button */}
        <CButton 
          onClick={navigateToUploadVehicle}
          style={{  
            '--cui-btn-color': 'white',
            '--cui-btn-bg': '#56844B',
            '--cui-btn-border-color': 'transparent',
            '--cui-btn-hover-bg': '#56844B',
            '--cui-btn-hover-border-color': '#56844B',
          }}
          className="px-2 py-2" 
        >
          Upload Vehicle
        </CButton>
        
        {/* Create Vehicle Button */}
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
            Create Vehicle
          </CButton>
        </div>

        {/* Create Vehicle Modal */}
        <CModal scrollable visible={createModalVisible} onClose={() => setCreateModalVisible(false)}>
          <CModalHeader>
            <CModalTitle style={{ color: '#56844B', fontWeight: 'bold', fontSize: '20px'}}>Create Vehicle</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className='overflow-auto'>
              <CFormLabel>Creating vehicle for vendor</CFormLabel>
              <CFormInput 
                value={vendor_ID} 
                className='mb-2'
                disabled
              />
              <CFormLabel>Vehicle Plate</CFormLabel>
              <CFormInput 
                value={vehiclePlate}
                onChange={(e) => setVehicleplate(e.target.value)}
                className='mb-2'
              />
              <CFormLabel>Vehicle Type</CFormLabel>
              <CFormInput 
                value={vehicleType}
                onChange={(e) => setVehicletype(e.target.value)}
                className='mb-2'
              />
              <CFormLabel>Capacity</CFormLabel>
              <CFormInput 
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className='mb-2'
              />
            </CForm>
          </CModalBody>
          <CModalFooter className="d-flex justify-content-center">
            <CButton 
              style ={{'background': '#56844B', width: '70%'}}
              onClick={handleCreateVehicle}
            >
              Create
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
          placeholder="Search vehicle plate"
        />
      </div>

      {/* Vehicle Overview Table */}
      <Card className="overflow-scroll h-full w-full">
        <CardBody style={{ padding: 0 }}>
          {tableData.length === 0 ? (
            <Typography className="p-4">No vehicles available</Typography>
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
                  .filter((row) => row.vehicle_plate.toLowerCase().includes(searchQuery.toLowerCase()))  // .filter for real time search query
                  .slice(startIndex, startIndex + rowsPerPage)  // .slice for pagination
                  .map(( data, index ) => {
                  const isLast = index === data.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={data.vehicle_plate}>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.vehicle_plate}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.vehicle_type}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.capacity}
                        </Typography>
                      </td>

                      <td className={classes}>
                        <IconButton variant="text" color="blue-gray"
                          onClick={() => showUpdateModal(data.vehicle_plate, data.vehicle_type, data.capacity)}>
                          <CIcon icon={cilPencil} />
                        </IconButton>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Delete">
                          <IconButton variant="text" color="blue-gray" onClick={() => showDeleteConfirmation(data.vehicle_plate)}>
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}

                {/* IMPORTANT NOTE, modal code should be placed outside of the table map function */}
                {/* Update vehicle modal */}
                <CModal backdrop='static' scrollable visible={updateModalVisible} onClose={() => setUpdateModalVisible(false)}>
                  <CModalHeader>
                    <CModalTitle style={{ color: '#56844B', fontWeight: 'bold', fontSize: '20px' }}>
                      Update Vehicle
                    </CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <CForm className="overflow-auto">
                      <CFormLabel>Vehicle Plate</CFormLabel>
                      <CFormInput 
                        value={vehiclePlate} 
                        className="mb-2"
                        disabled 
                      />
                      <CFormLabel>Vehicle Type</CFormLabel>
                      <CFormInput
                        value={updatedVehicletype}
                        onChange={(e) => setUpdatedVehicletype(e.target.value)}
                        className="mb-2"
                      />
                      <CFormLabel>Capacity</CFormLabel>
                      <CFormInput
                        value={updatedCapacity}
                        onChange={(e) => setUpdatedCapacity(e.target.value)}
                        className="mb-2"
                      />
                    </CForm>
                  </CModalBody>
                  <CModalFooter className="d-flex justify-content-center">
                    <CButton style={{ background: '#56844B', width: '70%' }} onClick={handleUpdateVehicle}>
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
                    <p>Are you sure you want to delete this vehicle?</p>
                  </CModalBody>
                  <CModalFooter>
                    <CButton onClick={handleDeleteVehicle} color="light">
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