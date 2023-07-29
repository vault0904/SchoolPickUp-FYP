import React, { useState } from 'react';
import axios from 'axios';
import '../css/defaultstyle.css'

const UploadSchedule = () => {
  const [file, setFile] = useState(null);
  const handleFile = (e) => {
      setFile(e.target.files[0]);
  }
  const handleUpload = () => {
    if (file != null) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // convert pdf file into base64 string for upload purposes
        const base64String = reader.result.split(',')[1];

        // define which folder to upload to in S3
        const folder = '/schooladmin'
        // define and trim file name
        let name = file.name;
        name = name.replace(/[^A-Za-z0-9.-]/g, ''); // Remove special characters from the file name
        // get file type
        const type = file.type;
        
        axios.post('https://46heb0y4ri.execute-api.us-east-1.amazonaws.com/dev/api/s3/uploadfile', { file: base64String, name: name, folderName: folder, type: type })
          .then((uploadFileRes) => {
            // After successful upload, insert URI into schedule table
            // get the URI returned by successful upload
            // get userid and schoolid of poster
            const uri = uploadFileRes.data.imageURL
            const userid = localStorage.getItem('userid')
            const schoolid = localStorage.getItem('schoolid')
            
            // Make the second POST request to upload the schedule to the database
            axios.post('https://lagj9paot7.execute-api.ap-southeast-1.amazonaws.com/dev/api/schadm-uploadschedule', { uri: uri, userid: userid, schoolid: schoolid })
            .then((createScheduleRes) => {
              const apiresult = createScheduleRes.data;
              if (apiresult.success) {
                alert('Upload success. View in schedules page');
                window.location.reload();
              } else {
                alert(apiresult.errlog);
              }
            })
            .catch((err) => {
              alert(err);
            });
          })
          .catch((err) => {
              alert(err)
          })
      }
      reader.readAsDataURL(file);

    } else {
      alert("File cannot be empty")
    }
  }

  return (
    <div>Upload your schoold schedule here PDF format. Only lesser than 10mb files accepted
      <br/><br/>
      <input type="file" onChange={handleFile} />
      <br/><br/>
      <button onClick={handleUpload}> Upload to S3</button>
    </div>
  );
};

export default UploadSchedule;