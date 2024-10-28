import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios'; // For making HTTP requests
import { Baseurl } from '../../../Utils/Constants';
import { getCookie } from 'cookies-next';
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify

const ModelAgencySiteSiteUpload = ({ show, handleClose, estimateId,getSingleData }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false); // Track upload status

  // Function to handle file download
  const handleDownload = () => {
    const fileUrl = '/TemplateCSV.csv';
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = 'TemplateCSV.csv'; // Filename for the downloaded file
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Function to handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  // Function to handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload.'); // Notify user to select a file
      return;
    }

    setUploading(true); // Start the upload process

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('estimate_id', estimateId); // Include estimateId

    // Get custom headers from cookies
    const token = getCookie("token");
    const db_name = getCookie("db_name");

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      db: db_name,
      pass: "pass",
      // Do not set 'Content-Type' header explicitly
    };

    try {
      // Send file and estimateId to the server
      const response = await axios.post(`${Baseurl}/db/media/estimationAgencyBusiness/addSitesForAgencyEstimates`, formData, { headers });
      toast.success('File uploaded successfully.'); 

      console.log("response is ",response)// Notify user of successful upload
      setFile(null); // Clear the file input
      getSingleData(estimateId)
    } catch (error) {
      // More detailed error logging
      console.error('Error uploading file:', error);
      toast.error('Error uploading file. Please try again.'); // Notify user of upload error
    } finally {
      setUploading(false); // End the upload process
    }
  };

  return (
    <>
      <Modal className="commonModal" show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload Site</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <strong style={{ color: 'red' }}>Important:</strong>Please download the template first, then upload the edited CSV file.
          </div>
          <Form>
            <Form.Group controlId="fileDownload">
              <Form.Label>Download the CSV template:</Form.Label>
              <Button
                variant="secondary"
                onClick={handleDownload}
                className="mb-3" // Add margin bottom to separate from next form section
              >
                Download CSV
              </Button>
            </Form.Group>

            <Form.Group controlId="fileUpload">
              <Form.Label>Upload the completed CSV:</Form.Label>
              <Form.Control
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleFileUpload}
            disabled={!file || uploading} // Disable the button if no file is selected or if uploading is in progress
          >
            {uploading ? 'Uploading...' : 'Submit'}
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer /> {/* Add ToastContainer to render the toasts */}
    </>
  );
};

export default ModelAgencySiteSiteUpload;









//using on Reader
// import React, { useState } from 'react';
// import { Button, Modal, Form } from 'react-bootstrap';
// import axios from 'axios'; // For making HTTP requests
// import { Baseurl } from '../../../Utils/Constants';
// import { getCookie } from 'cookies-next';
// import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
// import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify

// const ModelAgencySiteSiteUpload = ({ show, handleClose, estimateId }) => {
//   const [file, setFile] = useState(null);
//   const [fileContent, setFileContent] = useState(null); // Store the file content
//   const [uploading, setUploading] = useState(false); // Track upload status

//   // Function to handle file download
//   const handleDownload = () => {
//     const fileUrl = '/TemplateCSV.csv';
//     const a = document.createElement('a');
//     a.href = fileUrl;
//     a.download = 'TemplateCSV.csv'; // Filename for the downloaded file
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   };

//   // Handle file selection and read the content using FileReader
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     const allowedTypes = ['text/csv', 'application/vnd.ms-excel']; // Only allow CSV file types

//     if (selectedFile && allowedTypes.includes(selectedFile.type)) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setFileContent(reader.result); // Store file content after reading it
//       };
//       reader.readAsText(selectedFile); // Read the file content as text
//       setFile(selectedFile); // Store the file
//     } else {
//       toast.error("Invalid file type. Please upload a valid CSV file."); // Notify user of invalid file type
//       setFile(null); // Clear the file input if it's not valid
//       setFileContent(null); // Clear the file content
//     }
//   };

//   // Function to handle file upload
//   const handleFileUpload = async () => {
//     if (!file) {
//       toast.error('Please select a file to upload.'); // Notify user to select a file
//       return;
//     }

//     setUploading(true); // Start the upload process

//     // Create FormData object for file upload
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('estimate_id', estimateId); // Include estimateId

//     // Get custom headers from cookies
//     const token = getCookie("token");
//     const db_name = getCookie("db_name");

//     const headers = {
//       Accept: "application/json",
//       Authorization: `Bearer ${token}`,
//       db: db_name,
//       pass: "pass",
//       // Do not set 'Content-Type' header explicitly
//     };

//     try {
//       // Send file and estimateId to the server
//       await axios.post(`${Baseurl}/db/media/estimationAgencyBusiness/addSitesForAgencyEstimates`, formData, { headers });
//       toast.success('File uploaded successfully.'); // Notify user of successful upload
//       setFile(null); // Clear the file input
//       setFileContent(null); // Clear the file content
//       handleClose(); // Close the modal after successful upload
//     } catch (error) {
//       // More detailed error logging
//       console.error('Error uploading file:', error);
//       toast.error('Error uploading file. Please try again.'); // Notify user of upload error
//     } finally {
//       setUploading(false); // End the upload process
//     }
//   };

//   return (
//     <>
//       <Modal className="commonModal" show={show} onHide={handleClose} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Upload Site</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="mb-4">
//             <strong style={{ color: 'red' }}>Important:</strong> Please download the template first, then upload the edited CSV file.
//           </div>
//           <Form>
//             <Form.Group controlId="fileDownload">
//               <Form.Label>Download the CSV template:</Form.Label>
//               <Button
//                 variant="secondary"
//                 onClick={handleDownload}
//                 className="mb-3" // Add margin bottom to separate from next form section
//               >
//                 Download CSV
//               </Button>
//             </Form.Group>

//             <Form.Group controlId="fileUpload">
//               <Form.Label>Upload the completed CSV:</Form.Label>
//               <Form.Control
//                 type="file"
//                 accept=".csv"
//                 onChange={handleFileChange}
//               />
//               {file && <p className="mt-2">Selected File: {file.name}</p>}
//               {fileContent && (
//                 <pre className="mt-3" style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#f8f9fa', padding: '10px' }}>
//                   {fileContent} {/* Display file content for preview */}
//                 </pre>
//               )}
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button
//             variant="primary"
//             onClick={handleFileUpload}
//             disabled={!file || uploading} // Disable the button if no file is selected or if uploading is in progress
//           >
//             {uploading ? 'Uploading...' : 'Submit'}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//       <ToastContainer /> {/* Add ToastContainer to render the toasts */}
//     </>
//   );
// };

// export default ModelAgencySiteSiteUpload;


