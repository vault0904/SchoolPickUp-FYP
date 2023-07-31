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
import { TrashIcon } from "@heroicons/react/24/solid";
import '../css/defaultstyle.css';
import ConfirmationModal from './ConfirmationModal';

export default function VendorTable() {

//  VIEW FUNCTION START  //
//
  // Define table header here
  const TABLE_HEAD = ["VENDOR ID", "VENDOR NAME", "ADDRESS", "EMAIL", "SCHOOL PARTNERED WITH", "", ""];

  // Hook for setting vendor data
  const [tableData, setTableData] = useState([]);

  // API to get all vendor data
  const API_URL = 'https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/sysadm-getallbusvendor'

  // Axios get request to get all vendor data from db
  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        setTableData(res.data)  // With this set, we can map out the table data
      })
      .catch(err => {
        console.error(err);
      })
  }, []);

  // Navigate hook, is used when user clicks on 'view drivers'
  const navigate = useNavigate(); 
  const handleViewDrivers = (vendor_ID) => {
    navigate(`/system-admin/vendor/viewdrivers?vendor_ID=${vendor_ID}`);
  };

//
//  VIEW FUNCTION END  //





//  DELETE FUNCTION START //
//
  // Hook to toggle visibility of delete vendor modal, 
  // and to store the vendor id that was selected by user
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingVendorId, setDeletingVendorId] = useState('');  

  // Show the delete confirmation modal
  // When user click on the delete button, they will trigger this const, and pass the vendor id in the parameter
  const showDeleteConfirmation = (vendorid) => {
    setDeleteModalVisible(true);
    // store vendor id, so that we can use it in the axios delete request body later should user confirm to delete
    setDeletingVendorId(vendorid);
  };

  // API URL to delete vendor account
  const API_DELETEVEN = 'https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/sysadm-deletevendor'

  // Handle deletion of vendor,
  // Triggered when user clicks on 'confirm' in delete modal
  const handleDeleteVendor = async () => {
    try {
      const res = await axios.delete(API_DELETEVEN, { data: { deletingVendorId } });

      // After API returns a response
      // We check if response returned is True or False 
      // We can manipulate the kind of response we want in API lambda, for now it is set as response is either True or False
      // Return True means query executed, vendor account deleted
      // Return False means some error occured, either query did not execute properly or validation check stopped the query 
      const apiResult = res.data;
      if (apiResult.success) {
        // Vendor successfully deleted
        alert('Vendor successfully deleted');
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
  }
//
// DELETE FUNCTION END  //

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p 
          className="font-bold mx-auto text-lg"
          style={{ fontSize: '20px', color: '#56844B', paddingLeft: '5%'}} >
          Vendor Account Management
        </p>
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
                  <tr key={data.vendor_ID}>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {data.vendor_ID}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {data.vendor_Name}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {data.address}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {data.email}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {data.school_ID}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography as="a" variant="small" color="blue" className="font-medium" 
                        onClick={() => handleViewDrivers(data.vendor_ID)} >
                        View drivers
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Tooltip content="Delete">
                        <IconButton variant="text" color="blue-gray" onClick={() => showDeleteConfirmation(data.vendor_ID)}>
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
                onConfirm={handleDeleteVendor}
                callingComponent="VendorTable"
              />
            </tbody>
          </table>
        </CardBody>
      </Card>
    </>
  )
}