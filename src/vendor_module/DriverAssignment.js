import { React, useState, useEffect } from 'react'
import axios from 'axios'
import {
  Card,
  CardBody,
  Typography,
  Tooltip,
  IconButton,
} from '@material-tailwind/react'
import {
  CButton,
  CModal,
  CForm,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilPencil } from "@coreui/icons";
import { TrashIcon } from "@heroicons/react/24/solid"
import '../css/defaultstyle.css'

export default function DriverAssignment() {
  // VIEW ASSIGNMENT START //
  const [driverTable, setDriverTable] = useState([]);
  const [vehicleTable, setVehicleTable] = useState([]);
  const [vehicleAssignments, setVehicleAssignments] = useState([]);
  const [combinedData, setCombinedData] = useState([]);

  // Define combined data table header
  const TABLE_HEAD = ["DRIVER ID", "FIRST NAME", "LAST NAME", "EMAIL", "CONTACT NO", "VEHICLE PLATE","VEHICLE TYPE", "CAPACITY", "DATE ASSIGNED", ""];

  const vendorid = localStorage.getItem('userid');

  // Get all vehicles and drivers associated with the vendor
  useEffect(() => {
    Promise.all([
      axios.get(`https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/ven-getvehicles/${vendorid}`),
      axios.get(`https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/ven-getdrivers/${vendorid}`)
    ])
      .then(([vehicleRes, driverRes]) => {
        setVehicleTable(vehicleRes.data);
        setDriverTable(driverRes.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  // Get all vehicle assignments associated with the driver IDs
  useEffect(() => {
    axios.get(`https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/ven-getvehicleassignments/${vendorid}`)
      .then((response) => {
        setVehicleAssignments(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Combine the data from driverTable, vehicleTable, and vehicleAssignments
  useEffect(() => {
    const combinedDataArray = [];
    driverTable.forEach((driver) => {
      const { driver_ID, firstName, lastName, email, contactNo } = driver;
      const driverAssignments = vehicleAssignments.filter((assignment) => assignment.driver_ID === driver_ID);
      driverAssignments.forEach((assignment) => {
        const { vehicle_Plate, datetime } = assignment;
        const assignedVehicle = vehicleTable.find((vehicle) => vehicle.vehicle_Plate === vehicle_Plate);
        const { vehicle_Type, capacity } = assignedVehicle || { vehicle_Type: '', capacity: '' };
  
        // Create an object for each row with named properties
        const rowData = {
          driver_ID,
          firstName,
          lastName,
          email,
          contactNo,
          vehicle_Plate,
          vehicle_Type,
          capacity,
          datetime,
        };
        combinedDataArray.push(rowData);
      });
    });
    setCombinedData(combinedDataArray);
    
  }, [driverTable, vehicleTable, vehicleAssignments]);
  
  // VIEW ASSIGNMENT END //

  // ASSIGN DRIVER START //
  const [assignDriverModalVisible, setAssignDriverModalVisble] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');

  const handleVehicleAssignment = async () => {
    // Validation, check if user actually selected a driver and a vehicle
    if (!selectedDriverId.trim() || !selectedVehicleId.trim()) {
      alert("Please select a driver and/or a vehicle first.");
      return;
    }
    // Proceed with creating assignment
    // IMPORTANT, datetime to-be inserted into DB must add 8 hours due to Singapore's timezone GMT +8
    const datetime = new Date();
    datetime.setHours(datetime.getHours() + 8);
    const formattedDatetime = datetime.toISOString();
    // IMPORTANT

    axios.post('https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/ven-createvehicleassignment', { 
      vehicleid: selectedVehicleId, 
      driverid: selectedDriverId, 
      formattedDatetime: formattedDatetime })
      .then(res => {
        if (res.data.success === true) {
          alert("Driver successfully assigned to the vehicle.");
          window.location.reload();
        } else {
          alert("Assignment unsuccessful, the driver you selected has been already assigned to a vehicle today.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("An error occurred while assigning the driver to the vehicle. Please try again later.");
      });
  };
  // ASSIGN DRIVER END //

  // EDIT ASSIGNMENT START //
  const [editAssignmentModalVisible, setEditAssignmentModalVisble] = useState(false);
  const [selectedEditDriverId, setSelectedEditDriverId] = useState('');
  const [selectedEditVehicleId, setSelectedEditVehicleId] = useState('');

  // EDIT ASSIGNMENT END //

  // Function to check if given date = todays date, used in filtering table
  const isToday = (date) => {
    const today = new Date();
    const givenDate = new Date(date);
        
    // Compare the date parts (year, month, and day)
    return (
      givenDate.getDate() === today.getDate() &&
      givenDate.getMonth() === today.getMonth() &&
      givenDate.getFullYear() === today.getFullYear()
    );
  };

  // Function to format the date as "30 July 2023"
  const [todaysDate, setTodaysDate] = useState('');
  useEffect(() => {
    const formatDate = (date) => {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    };
    // Get today's date
    const today = new Date();
    // Format today's date
    const formattedDate = formatDate(today);
    // Set the formatted date in the state
    setTodaysDate(formattedDate);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p 
          className="font-bold mx-auto text-lg"
          style={{ fontSize: '20px', color: '#56844B', paddingLeft: '23%'}} >
          Vehicle Assignment for {todaysDate}
        </p>

        {/* Assign driver button */}
        <CButton 
          onClick={()=>setAssignDriverModalVisble(!assignDriverModalVisible)}
          style={{  
            '--cui-btn-color': 'white',
            '--cui-btn-bg': '#56844B',
            '--cui-btn-border-color': 'transparent',
            '--cui-btn-hover-bg': '#56844B',
            '--cui-btn-hover-border-color': '#56844B',
          }}
          className="px-2 py-2" >
          Assign Driver
        </CButton>

        {/* Assign driver modal */}
        <CModal 
          scrollable 
          visible={assignDriverModalVisible} 
          onClose={() => setAssignDriverModalVisble(false)} 
          style={{marginTop: '40%', marginLeft: '14%'}}>
          <CModalHeader>
            <CModalTitle style={{ color: '#56844B', fontWeight: 'bold', fontSize: '20px'}}>Assign Driver</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className='overflow-auto'>
              <CFormSelect className='pt-2' onChange={(e) => setSelectedDriverId(e.target.value)}>
                <option value="blankdriver">Select a driver</option>
                {driverTable.map((driver) => (
                <option key={driver.driver_ID} value={driver.driver_ID}>
                  ID: {driver.driver_ID} | Name: {driver.firstName} {driver.lastName}
                </option>
                ))}
              </CFormSelect>
              <div className='pt-4'>
                <CFormSelect onChange={(e) => setSelectedVehicleId(e.target.value)}>
                  <option value="blankvehicle">Select a vehicle</option>
                  {vehicleTable.map((vehicle) => (
                  <option key={vehicle.vehicle_Plate} value={vehicle.vehicle_Plate}>
                  Vehicle plate: {vehicle.vehicle_Plate} | Capacity: {vehicle.capacity}
                  </option>
                  ))}
                </CFormSelect>
              </div>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <Typography>Don't see the driver or vehicle here? Register them in our site first</Typography>
            <div className="d-grid gap-2 col-6 mx-auto">
            <CButton
              style ={{'background': '#56844B'}}
              onClick={handleVehicleAssignment}>
              Confirm 
            </CButton>
            </div>
          </CModalFooter>
        </CModal>
      </div>

      {/* Vehicle assignment table */}
      <Card className="overflow-scroll h-full w-full">
          <CardBody style={{ padding: 0 }}>
            {combinedData.length === 0 ? (
              <Typography className="p-4">No vehicle assignments</Typography>
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
                  {combinedData
                    .filter((data) => isToday(data.datetime)) // Filter rows with datetime equal to today's date
                    .map(( data, index ) => {
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
                            {data.contactNo}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {data.vehicle_Plate}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {data.vehicle_Type}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {data.capacity}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {data.datetime}
                          </Typography>
                        </td>
                        {/* <td className={classes}>
                          <IconButton variant="text" color="blue-gray"
                            onClick={{}}>
                            <CIcon icon={cilPencil} />
                          </IconButton>
                        </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardBody>
      </Card>

    </>
  )
}