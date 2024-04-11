import React, { useState } from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import SaveIcon from '@mui/icons-material/Save';

const ChannelPartnerRegisterScreen = () => {
  const [aadharCardPreview, setAadharCardPreview] = useState(null);
  const [panCardPreviews, setPanCardPreviews] = useState([]);
  const [reraLicensePreviews, setReraLicensePreviews] = useState([]);
  const [bankChequePreviews, setBankChequePreviews] = useState([]);

  const handleAadharCardChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAadharCardPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePanCardChange = (event) => {
    const files = event.target.files;
    if (files) {
      const previews = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === files.length) {
            setPanCardPreviews(previews);
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const handleReraLicenseChange = (event) => {
    const files = event.target.files;
    if (files) {
      const previews = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === files.length) {
            setReraLicensePreviews(previews);
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  const handleBankChequeChange = (event) => {
    const files = event.target.files;
    if (files) {
      const previews = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === files.length) {
            setBankChequePreviews(previews);
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  };

  return (
    <div className='d-block w-100'>
      <section className="channel_partner_register">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <div className="my_profile d-flex align-items-center gap-3">
                <KeyboardBackspaceIcon />
                <span style={{ fontSize: '16PX', fontWeight: 600 }}>SignUp</span>
              </div>
              <div className="logo">
                <a href="#">
                  <img src="/DMS_IMAGES/kloudmart.png" alt />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="channel_partner_register">
        <div className="container-fluid">
          <div className="row">
            <div className="col col-xl-12 col-md-12 col-sm-12 ">
              <form className="px-2 body" method='post' style={{ position: 'relative' }}>
                <div className="row">
                  <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                    <label className="form-label">Name <span className="error-message">*</span></label>
                    <input className="form-control input-field" type="text" placeholder="Enter Name" id="Name" formcontrolname="Email" name="Name" />
                  </div>
                  <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                    <label className="form-label">Email <span className="error-message">*</span></label>
                    <input className="form-control input-field" type="text" placeholder="Enter Email" id="Email" formcontrolname="Email" name="Email" />
                  </div>
                  <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                    <label className="form-label">Mobile No. <span className="error-message">*</span></label>
                    <input className="form-control input-field" formcontrolname="Name" type="text" placeholder="Enter Mobile No." name="Mobile" />
                  </div>
                  <div className="col-12 mb-2">
                  </div>
                  <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                    <div className="d-flex flex-column gap-1">
                      <label className="form-label">Aadhar Card <span className="error-message">*</span></label>
                      <input type="file" onChange={handleAadharCardChange} className="form-control input-field" />
                      {aadharCardPreview && <img src={aadharCardPreview} alt="Aadhar Card Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />}
                    </div>
                  </div>
                  <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                  <div className="d-flex flex-column gap-1">
                  <label className="form-label">PAN Card <span className="error-message">*</span></label>
                    <input type="file" onChange={handlePanCardChange} multiple className="form-control input-field" />
                    {panCardPreviews.map((preview, index) => (
                      <img key={index} src={preview} alt={`PAN Card Preview ${index}`} style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '5px' }} />
                    ))}
                   </div>
                  </div>
                  <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                  <div className="d-flex flex-column gap-1">
                  <label className="form-label">RERA License <span className="error-message">*</span></label>
                    <input type="file" onChange={handleReraLicenseChange} multiple className="form-control input-field" />
                    {reraLicensePreviews.map((preview, index) => (
                      <img key={index} src={preview} alt={`RERA License Preview ${index}`} style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '5px' }} />
                    ))}
                   </div>
                  </div>
                  <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                  <div className="d-flex flex-column gap-1">
                  <label className="form-label">Bank Cancelled Cheque <span className="error-message" /></label>
                    <input type="file" onChange={handleBankChequeChange} multiple className="form-control input-field" />
                    {bankChequePreviews.map((preview, index) => (
                      <img key={index} src={preview} alt={`Bank Cancelled Cheque Preview ${index}`} style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '5px' }} />
                    ))}
                   </div>  
                  </div>
                  <div className="mt-3  md-text-center">
                    <button type="submit" className="btn btn-outline-dark btn-sm shadow rounded fw-normal px-4">
                      <SaveIcon style={{ fontSize: "20px", paddingBottom: "4px" }} />
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChannelPartnerRegisterScreen;
