import React from 'react'
import Papa from 'papaparse'
import {
  CButton,
  CContainer,
  CFormInput,
} from '@coreui/react'
import { useState } from 'react'
import { Card, CardHeader, Typography } from '@material-tailwind/react';
import '../css/defaultstyle.css'

export default function UploadChild() {
  //  UPLOAD FUNCTION START  //
  //
  // Papaparse codes
  // State to store csv data
  const [ data, setData ] = useState([]);
  const [ column, setColumn ] = useState([]);
  const [ value, setValue ] = useState([]);
  const [ numberOfRows, setNumberOfRows ] = useState('');

  const handleCSV = (e) => {
    Papa.parse(e.target.files[0], 
      {
        header: true,
        skipEmptyLines: true,
        complete: function(result) {
          const column = [];
          const value = [];
          result.data.forEach((d) => {
            // Check if all required values are present in the row
            const keys = Object.keys(d);
            const values = Object.values(d);
            const allValuesPresent = values.every((val) => val !== "");
    
            if (allValuesPresent) {
              column.push(keys);
              value.push(values);
            }
            // If any value is missing, skip this row and consider it invalid
            // Rows with missing values will not be pushed into column and value arrays.
          });

          setData(result.data);
          setColumn(column[0]);
          setValue(value);
          setNumberOfRows(value.length) // To see number of rows uploaded

        }
      }
    )
  }

  const handleSubmit = async () => {
      if (data.length == 0) {
        alert('Upload csv file first')
      } else {
        alert('Clicked submit')
        window.location.reload()
      }
  }
  //
  //  UPLOAD FUNCTION END //

  return (
    <>
      <CContainer 
        className='px-5 py-4 pb-5' 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <h1 
          style={{ color: '#56844B', fontWeight: 'bold', marginBottom: '25px', fontSize: '20px'}}>
          Upload Child Details
        </h1>
        <CFormInput 
          type="file" 
          id="formFile"
          accept=".csv"
          onChange={handleCSV}
          className='w-50'/>
        <div style={{marginTop: '40px'}} className='w-50'>
          <CButton 
            onClick={handleSubmit}
            style ={{'background': '#56844B', width: '50%'}}
            >
            Submit
          </CButton>
        </div>
      </CContainer>

      <CContainer className='px-4 py-2 pb-5'>
        {data.length == 0 ? '' : 
          <Typography variant="lead" className="text-center">
            Number of child data registered after upload: {numberOfRows} 
          </Typography>
        }

        <Typography variant="h5" className="pt-4 pb-5 text-center">
          How your csv should look like for uploading child details
        </Typography>

        <CardHeader color="blue-gray" className="pb-2">
          <img
            src=""  // put S3 link here
            alt="Child CSV sample image"
          />
        </CardHeader>

        <Typography variant="lead" color="red" className="px-5 pt-5">
          Notice: Any row(s) in the CSV that have empty values will be skipped 
        </Typography>

        {/* This table is for us to see if values from csv have been parsed properly or not only, delete later*/}
        {/* {data.length == 0 ? '' : (
          <>
            <table >
              <thead>
                <tr>
                  {column.map((col, idx) => (
                    <th key={idx}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {value.map((val, idx) => (
                  <tr key={idx}>
                    {val.map((v,i) => (
                      <td key={i}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
          )
        } */}
      </CContainer>
    </>
  )

}