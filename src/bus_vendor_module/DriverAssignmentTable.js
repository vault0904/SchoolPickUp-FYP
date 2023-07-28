import { React, useState, useEffect } from 'react'
import axios from 'axios'
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
  CDropdown,
  CDropdownToggle, 
  CDropdownMenu,
  CDropdownItem,
  CDropdownDivider,
  CFormSelect,
} from '@coreui/react'
import { TrashIcon } from "@heroicons/react/24/solid"
import '../css/defaultstyle.css'

export default function DriverAssignmentTable() {
// Explaination for start of DriverAssignmentTable function
// When vendors first enter this tab/page, we want to display a table that shows assignment details
// Assignment details consists of "ID", "DRIVER ID", "NAME", "EMAIL", "LICENSE", "BUS PLATE", "DATE"
// However, we do not have a table in the database that contains a compilation of these details
// Thus, base on current database design, the best way to get the this table of assignment details is to 'combine' tables from 'driver' and 'vehicle_used'.
// We can 'combine' through the common driver_IDs.
  


  // VIEW DRIVER ASSIGNMENT TABLE START //
  //
  // Firstly, retrieve vendor's userid from local storage
  // With the vendor's userid, we can use it to select all drivers associated with this vendor, in the driver table
  const vendorid = localStorage.getItem('userid')

  // Next, API request to retrieve drivers associated with vendors
  // API
  const API_GETDRIVER = 'https://o92cl4kdw2.execute-api.ap-southeast-1.amazonaws.com/dev/api/busven-getdrivers'

  // Declare state to store driver table data
  const [driverTableData, setDriverTableData] = useState([]);

  // Send API request
  useEffect(() => {
    axios.post(API_GETDRIVER, {vendorid})
      .then(res => {
        // Set driver table data to state
        setDriverTableData(res.data)
        // Now we have the data (array) of all drivers associated with the vendor in this driverTableData state

        // If driver(s) associated with this particular vendor has been assigned to their vehicle(s), there will be the record(s) in the vehicle_used table
        // Otherwise, the data (array) will be empty (meaning vendor has not assigned any driver to any vehicle before)
      })
      .catch(err => {
        console.error(err);
      })
  }, []);

  // Next, API request to retrieve assignments associated with the drivers/vendor (aka the vehicle_used table)
  // API
  const API_GETASSIGNMENT = 'https://o92cl4kdw2.execute-api.ap-southeast-1.amazonaws.com/dev/api/busven-getassignment'

  // Declare state to store vehicle_used table data
  const [vehicleUsedTableData, setVehicleUsedTableData] = useState([]);
  
  // Declare state to hold list of driver IDs associated with vendor
  // Important, will be used for the Assign Driver modal later
  const [driverIDs, setDriverIDs] = useState([]);

  useEffect(() => {
    if (driverTableData.length > 0) {
      // If data (array) is not empty
      // retrieve all driver ids in the data (array)
      const driverIDs = driverTableData.map((d) => d.driver_ID);
      setDriverIDs(driverIDs);  // For assign driver modal later

      // Send API request
      axios.post(API_GETASSIGNMENT, {driverids: driverIDs})
        .then(res => {
          // We are expecting API to return us the vehicle_used data (array) matching the driver id(s). Handle the data
          setVehicleUsedTableData(res.data)
          // Now we have the data (array) of all assignments that are related to the driver/vendor
      })
      .catch(err => {
        console.error(err); 
      })
    }
  }, [driverTableData]);

  // Next, with both tables available, we can proceed to 'combine' them
  // Declare the state to store the combined table data
  const [combinedTableData, setCombinedTableData] = useState([]);

  useEffect(() => {
    if (driverTableData.length > 0 && vehicleUsedTableData.length > 0) 
    {
      // First, create a map to look up driver details based on 'driver_ID'
      const driverMap = new Map();
      driverTableData.forEach((driver) => 
      {
        driverMap.set(driver.driver_ID, driver);
      });

      // Next, combine the tables by iterating through vehicleUsedTableData and adding the corresponding driver details
      const combinedData = vehicleUsedTableData.map((vehicle) => 
      (
        {
          ...vehicle,
          ...driverMap.get(vehicle.driver_ID),
        }
      ));

      // Finally, set the combined data to the state
      setCombinedTableData(combinedData);
      // Now we can map out the table data
    }

  }, [driverTableData, vehicleUsedTableData])

  // Define table header
  const TABLE_HEAD = ["DRIVER ID", "FIRST NAME", "LAST NAME", "EMAIL", "LICENSE", "BUS PLATE", "DATE ASSIGNED", ""];
  //
  // VIEW DRIVER ASSIGNMENT TABLE END //




  //  ASSIGN DRIVER FUNCTION START  //
  // 
    // State for assign driver modal
    const [ assignDriverModalVisible, setAssignDriverModalVisble] = useState(false);
  //
  // ASSIGN DRIVER FUNCTION END //




  //  RETRIEVE ALL VEHICLES ASSOCIATED WITH VENDOR START  //
  //
    // State to store vehicle table data
    // Not needed as of now because we don't need to retrieve any additional vehicle details from the vehicle table 
    // const [vehicleTableData, setVehicleTableData] = useState([]);

    // State to save list of vehicles associated with vendor
    const [vehiclePlates, setVehiclePlates] = useState([]);
    
    // Next, API request to retrieve vehicles associated with vendors
    // API
    const API_GETVEHICLE = 'https://o92cl4kdw2.execute-api.ap-southeast-1.amazonaws.com/dev/api/busven-getvehicles';

    useEffect(() => {
      axios.post(API_GETVEHICLE, { vendorid })
        .then(res => {
          // Retrieve the vehicle_plate values from the API response, and store in the vehiclePlates state (used in assign driver modal)
          const vehicleplates = res.data.map((v) => v.vehicle_plate);
          setVehiclePlates(vehicleplates);  
        })
        .catch(err => {
          console.error(err);
        });
    }, [vendorid]);

  //
  // RETRIEVE ALL VEHICLES ASSOCIATED WITH VENDOR END //

  //  SEARCH BOX FUNCTION START  //
  //
  // Hooks for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;  // number of rows to display
  const startIndex = (currentPage - 1) * rowsPerPage;

  // Hook for search
  const [searchQuery, setSearchQuery] = useState('');
  //
  // SEARCH BOX FUNCTION END  //


  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p 
          className="font-bold mx-auto text-lg"
          style={{ fontSize: '20px', color: '#56844B', paddingLeft: '23%'}} >
          Driver Assignment
        </p>

        {/* Assign Driver Button */}
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
              <CFormLabel>Select driver</CFormLabel>
              <CFormSelect className='pt-2'>
                {driverIDs.map(id => (
                  <option key={id}>{id}</option>
                ))}
              </CFormSelect>
              <CFormLabel>Select vehicle</CFormLabel>
              <CFormSelect>
                {vehiclePlates.map(plates => (
                  <option key={plates}>{plates}</option>
                ))}
              </CFormSelect>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <div className="d-grid gap-2 col-6 mx-auto">
            <CButton
              style ={{'background': '#56844B'}}
              onClick={{}}>
              Confirm 
            </CButton>
            </div>
          </CModalFooter>
        </CModal>
      </div>

      {/* Search box */}
      <div className='px-5 py-3'>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search driver user ID"
        />
      </div>

      {/* Driver assignment table */}
      <Card className="overflow-scroll h-full w-full">
          <CardBody style={{ padding: 0 }}>
            {combinedTableData.length === 0 ? (
              <Typography className="p-4">No assignments to driver</Typography>
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
                  {combinedTableData
                    .filter((row) => row.driver_ID.toLowerCase().includes(searchQuery.toLowerCase()))  // .filter for real time search query
                    .slice(startIndex, startIndex + rowsPerPage)  // .slice for pagination
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
                            {data.license}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {data.vehicle_plate}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {data.timestamp}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Delete">
                            <IconButton variant="text" color="blue-gray" onClick={{}}>
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })}
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
              {Array.from(Array(Math.ceil(combinedTableData.length / rowsPerPage)).keys()).map((page) => (
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
              size="sm" disabled={currentPage === Math.ceil(combinedTableData.length / rowsPerPage)}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </CardFooter>
      </Card>
    </>
  )
}