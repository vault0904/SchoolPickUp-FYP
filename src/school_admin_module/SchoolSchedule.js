// //  BEFORE INTEGRATING REX API (WORKING)
//   import React, { useState } from 'react';
//   import axios from 'axios';
//   import '../css/defaultstyle.css'

// const SchoolSchedule = () => {
//   const [file, setFile] = useState(null);
//   const handleFile = (e) => {
//       setFile(e.target.files[0]);
//   }
//   const handleUpload = () => {
//     if (file != null) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64String = reader.result.split(',')[1];
//         const name = file.name;
//         const type = file.type;
        
//         axios.post("https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/uploadfile", { file: base64String, name: name, type: type })
//           .then((res) => {
//               alert(res);
//               window.location.reload();
//           })
//           .catch((err) => {
//               alert(err)
//           })
//       }
//       reader.readAsDataURL(file);
//     } else {
//       alert("FILE CANNOT BE EMPTY")
//     }
//   }

//   return (
//     <div>
//       <div>File Upload Progress is</div>
//       <input type="file" onChange={handleFile} />
//       <button onClick={handleUpload}> Upload to S3</button>
//     </div>
//   );
// };

// export default SchoolSchedule;







// // AFTER INTEGRATING REX API (WORKING)
// import React, { useState } from 'react';
// import axios from 'axios';
// import '../css/defaultstyle.css'

// const SchoolSchedule = () => {
//   const [file, setFile] = useState(null);
//   const handleFile = (e) => {
//       setFile(e.target.files[0]);
//   }
//   const handleUpload = () => {
//     if (file != null) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64String = reader.result.split(',')[1];
//         // const name = file.name;
//         // const parsedName = name.replace(/[\\/@#$%^&+{}|]/g, '-');
//         let name = file.name; // The file name
//         name = name.replace(/[^A-Za-z0-9.-]/g, ''); // Remove special characters from the file name
  

//         const folder = '/parent'
//         const type = file.type;
        
//         axios.post('https://46heb0y4ri.execute-api.us-east-1.amazonaws.com/dev/api/s3/uploadfile', { file: base64String, name: name, folderName: folder, type: type })
//           .then((res) => {
//               alert('File upload successfully. View it here: ' + '')
//               console.log(res.data.imageURL);
//               // window.location.reload();
//           })
//           .catch((err) => {
//               alert(err)
//           })
//       }
//       reader.readAsDataURL(file);
//     } else {
//       alert("FILE CANNOT BE EMPTY")
//     }
//   }

//   return (
//     <div>
//       <div>File Upload Progress is</div>
//       <input type="file" onChange={handleFile} />
//       <button onClick={handleUpload}> Upload to S3</button>
//     </div>
//   );
// };

// export default SchoolSchedule;


























import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Card, 
  CardBody, 
  Typography, 
  Tooltip, 
  IconButton,
  CardFooter,
  Button,
  Input,
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
import '../css/defaultstyle.css';

export default function SchoolSchedule() {
  // RETRIEVE SCHEDULE START //
  // Define table header
  const TABLE_HEAD = ["SCHEDULE ID", "SCHEDULE DESCRIPTION", "YEAR", "POSTED BY", "", ""];

  // Declare hook, which will be used to set schedule data, after getting the data from API below
  const [scheduleTable, setScheduleTable] = useState([]);

  // Retrieve school ID from localstorage
  // So that we can use it to find all schedule that is uploaded by the school before
  const school_ID = localStorage.getItem('schoolid');

  // Axios post request
  useEffect(() => {
    axios.get(`https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/schadm-getschedule/${school_ID}`)
      .then(res => {
        // Set in the hook declared earlier
        // We can now use the scheduleTable.map function to map out the data
        setScheduleTable(res.data)
      })
      .catch(err => {
        console.error(err);
      })
  }, []);
  // RETRIEVE SCHEDULE END //


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


  // UPLOAD FUNCTION START //

  // UPLOAD FUNCTION END //


  // DELETE FUNCTION START //
  const [ deleteModalVisible, setDeleteModalVisible ] = useState(false)
  const [ deleteScheduleId, setDeleteScheduleId ] = useState()

  const viewDeleteModal = ( scheduleid ) => {
    setDeleteScheduleId(parseInt(scheduleid))
    setDeleteModalVisible(true)
  }

  const handleDeleteSchedule = async () => {
    try {
      
      const res = await axios.delete('https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/schadm-deleteschedule', { data: { id: deleteScheduleId }  } )
      console.log(res.data)
      const apiResult = res.data;
      if (apiResult.success) {
        // Schedule successfully deleted
        alert('Schedule successfully deleted');
        window.location.reload();
      } else {
        // View error
        alert(apiResult.errlog);
      }
    } catch(err) {
      alert(err)
    }
  }

  // DELETE FUNCTION END //

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p 
          className="font-bold mx-auto text-lg"
          style={{ fontSize: '20px', color: '#56844B', paddingLeft: '5%'}} >
          School Schedule
        </p>
      
        {/* Upload schedule button */}
        <CButton 
          onClick={{}}
          style={{
            '--cui-btn-color': 'white',
            '--cui-btn-bg': '#56844B',
            '--cui-btn-border-color': 'transparent',
            '--cui-btn-hover-bg': '#56844B',
            '--cui-btn-hover-border-color': '#56844B',
          }}
          className="px-5 py-2" >
          Upload Schedule
        </CButton>
      </div>

      {/* Search box */}
      <div className='px-5 py-3'>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search schedule description"
        />
      </div>

      {/* School Schedule Table */}
      <Card className="overflow-scroll h-full w-full">
        <CardBody style={{ padding: 0 }}>
          {scheduleTable.length === 0 ? (
            <Typography className="p-4">No schedule uploaded</Typography>
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
                {scheduleTable
                  .filter((row) => row.description.toLowerCase().includes(searchQuery.toLowerCase()))  // .filter for real time search query
                  .slice(startIndex, startIndex + rowsPerPage)  // .slice for pagination
                  .map(( data, index ) => {
                  const isLast = index === data.length - 1;
                  const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={data.schedule_ID}>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.schedule_ID}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.description}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.year}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {data.schAdmin_ID}
                        </Typography>
                      </td>
                      <td className={classes}>
                      <a href={data.S3_URL} target="_blank" rel="noopener noreferrer" className="underline text-blue-300 hover:text-blue-800">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          View schedule
                        </Typography>
                      </a>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Delete">
                          <IconButton variant="text" color="blue-gray" onClick={() => viewDeleteModal(data.schedule_ID)}>
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}

                {/* IMPORTANT NOTE, modal code should be placed outside of the table map function */}
                {/* Delete confirmation modal */}
                <CModal scrollable visible={deleteModalVisible} onClose={() => setDeleteModalVisible(false)}>
                  <CModalHeader>
                    <CModalTitle style={{ color: '#56844B', fontWeight: 'bold', fontSize: '20px' }}>
                      Confirm Deletion
                    </CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    <p>Are you sure you want to delete this schedule?</p>
                  </CModalBody>
                  <CModalFooter>
                    <CButton onClick={handleDeleteSchedule} color="light">
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
            {Array.from(Array(Math.ceil(scheduleTable.length / rowsPerPage)).keys()).map((page) => (
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
            size="sm" disabled={currentPage === Math.ceil(scheduleTable.length / rowsPerPage)}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}