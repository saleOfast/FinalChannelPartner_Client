import Link from 'next/link'
import React from 'react'

const ChannelSignUpScreen = () => {
  return (
    <>
        <section className="Sign-Up">
  <div className="container">
    <div className="row">
      <div className="col-12 col-md-7">
        <div className="row gx-3">
          <div className="Sign-In-logo">
            <img src="/ChannelPartner/logo.png" alt />
          </div>
          <div className="col-6">
            <div style={{height: 320, width: '100%', backgroundImage: 'url(/ChannelPartner/signup-img1.png)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', marginBottom: 15, borderTopLeftRadius: 10}}>
            </div>
            <div style={{height: 336, width: '100%', backgroundImage: 'url(/ChannelPartner/signup-img3.png)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', marginBottom: 15, borderBottomLeftRadius: 10}}>
            </div>
            <div>
            </div>
          </div>
          <div className="col-6">
            <div style={{height: 176, width: '100%', backgroundImage: 'url(/ChannelPartner/signup-img2.png)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', marginBottom: 15, borderTopRightRadius: 10}}>
            </div>
            <div style={{height: 368, width: '100%', backgroundImage: 'url(/ChannelPartner/signup-img4.png)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', marginBottom: 15, borderBottomRightRadius: 10}}>
            </div>
          </div>
          <div className="col-12 d-flex gap-3">
            <div style={{height: 192, width: '100%', backgroundImage: 'url(/ChannelPartner/signup-img2.png)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', marginBottom: 15, borderBottomLeftRadius: 10}}>
            </div>
            <div style={{height: 304, width: '100%', backgroundImage: 'url(/ChannelPartner/signup-img5.png)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', marginBottom: 15, borderBottomRightRadius: 10, marginTop: '-110px'}}>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-5 d-flex justify-content-center">
        <div className="Sign-Up_Sign-In">
          <h3 className="Perfect-Home">Find Your Perfect Home. </h3>
          <div className="underline" />
          <div className="d-flex pt-5"> <Link href="/CHANNEL/Signin" className="nav-link d-flex flex-column gap-2 align-items-center pb-3 Sign-In-btn" id="Sign-In" style={{backgroundColor: '#ecf0ff', color: '#9c9aa5'}}>
              Sign In</Link>
            <div  className="nav-link d-flex flex-column gap-2 align-items-center pb-3 Sign-Up-btn text-white" id="Sign-Up" data-bs-toggle="tab" data-bs-target="#Sign-Up-tab" style={{backgroundColor: '#293790'}}>
              Sign Up</div>
          </div>
          <div className="perfect-home-form pt-1">
            <section className="Details_Form">
              <div className="container pt-3">
                <form id="survey-form" method="GET" action className="d-flex flex-column gap-3">
                  <div className="d-flex gap-2">
                    <div className="rowTab">
                      <div className="labels">
                        <label id="name-label" htmlFor="name">Name</label>
                        <span>*</span>
                      </div>
                      <div className="rightTab">
                        <input autofocus type="text" name="name" id="name" className="input-field" placeholder="Enter First Name" required />
                      </div>
                    </div>
                    <div className="rowTab">
                      <div className="labels">
                        <label id="name-label" htmlFor="name" />
                        <span />
                      </div>
                      <div className="rightTab">
                        <input autofocus type="text" name="name" id="last" className="input-field" placeholder="Enter Last Name" required />
                      </div>
                    </div>
                  </div>
                  <div className="rowTab">
                    <div className="labels">
                      <label id="Organization" htmlFor="name">Organization</label>
                      <span>*</span>
                    </div>
                    <div className="rightTab">
                      <input autofocus type="text" name="name" id="Organization" className="input-field" placeholder="Enter Organization Name" required />
                    </div>
                  </div>
                  <div className="rowTab">
                    <div className="labels">
                      <label id="number" htmlFor="number">Mobile Number</label>
                      <span>*</span>
                    </div>
                    <div className="rightTab">
                      <input type="tel" name="number" id="num" className="input-field" required placeholder="Enter Mobile Number" />
                    </div>
                  </div>
                  <div className="rowTab">
                    <div className="labels">
                      <label id="email-label" htmlFor="email">Email</label>
                      <span>*</span>
                    </div>
                    <div className="rightTab">
                      <input type="email" name="email" id="email" className="input-field" required placeholder="Enter Email" />
                    </div>
                  </div>
                  <div className="rowTab">
                    <div className="labels">
                      <label id="email-label" htmlFor="email">Location</label>
                      <span>*</span>
                    </div>
                    <div className="rightTab d-flex gap-2">
                      <select name className="form-select dropdown">
                        <option value selected disabled>Select State</option>
                        <option className="dropdown-item" href="#">A</option>
                        <option className="dropdown-item" href="#">B</option>
                        <option className="dropdown-item" href="#">C</option>
                      </select>
                      <select name className="form-select dropdown">
                        <option value selected disabled>Select City</option>
                        <option className="dropdown-item" href="#">A</option>
                        <option className="dropdown-item" href="#">B</option>
                        <option className="dropdown-item" href="#">C</option>
                      </select>
                    </div>
                  </div>
                  <div className="rowTab">
                    <div className="labels">
                      <label id="GST" htmlFor="name">GST Number</label>
                      <span />
                    </div>
                    <div className="rightTab">
                      <input autofocus type="text" name="name" id="GST" className="input-field" placeholder="Enter GST Number" required />
                    </div>
                  </div>
                  {/* 
                                  <div class="rowTab">
                                      <div class="labels">
                                          <label id="name-label" for="name">Attachment
                                          </label>
                                          <span>*</span>
                                      </div>
                                      <div class="rightTab">
                                          <input autofocus type="file" name="name" id="name"
                                              class="input-field form-control"
                                              placeholder="enter your aadhar number" required>
                                      </div>
                                  </div> */}
                  <div className="d-flex justify-content-between  upload-files">
                    <div className="rowTab">
                      <div className="labels">
                        <label id="name-label" htmlFor="name">Aadhar Card </label>
                        <span>*</span>
                      </div>
                      <div className="rightTab">
                        <label htmlFor="adh" className="form-control d-flex justify-content-between align-items-center" style={{width: 160, height: 48}}>Upload<img src="/ChannelPartner/upload-file.svg" alt style={{height: 24}} /></label>
                        <input autofocus type="file" name="name" id="adh" className="input-field" placeholder="enter your aadhar number" style={{display: 'none'}} required />
                      </div>
                    </div>
                    <div className="rowTab">
                      <div className="labels">
                        <label id="name-label" htmlFor="name">PAN Card </label>
                        <span>*</span>
                      </div>
                      <div className="rightTab">
                        <label htmlFor="adh" className="form-control d-flex justify-content-between align-items-center" style={{width: 160, height: 48}}>Upload<img src="/ChannelPartner/upload-file.svg" alt style={{height: 24}} /></label>
                        <input autofocus type="file" name="name" id="adh" className="input-field" placeholder="enter your aadhar number" style={{display: 'none'}} required />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between upload-files">
                    <div className="rowTab">
                      <div className="labels">
                        <label id="name-label" htmlFor="name">RERA License </label>
                        <span>*</span>
                      </div>
                      <div className="rightTab">
                        <label htmlFor="adh" className="form-control d-flex justify-content-between align-items-center" style={{width: 160, height: 48}}>Upload<img src="/ChannelPartner/upload-file.svg" alt style={{height: 24}} /></label>
                        <input autofocus type="file" name="name" id="adh" className="input-field" placeholder="enter your aadhar number" style={{display: 'none'}} required />
                      </div>
                    </div>
                    <div className="rowTab">
                      <div className="labels">
                        <label id="name-label" htmlFor="name">Aadhar Card </label>
                        <span>*</span>
                      </div>
                      <div className="rightTab">
                        <label htmlFor="adh" className="form-control d-flex justify-content-between align-items-center" style={{width: 160, height: 48}}>Upload<img src="/ChannelPartner/upload-file.svg" alt style={{height: 24}} /></label>
                        <input autofocus type="file" name="name" id="adh" className="input-field" placeholder="enter your aadhar number" style={{display: 'none'}} required />
                      </div>
                    </div>
                  </div>
                  <button id="craete-account" type="submit" className="border-0">Create Account</button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    </>
  )
}

export default ChannelSignUpScreen