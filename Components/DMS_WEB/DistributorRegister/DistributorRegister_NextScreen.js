import { useRouter } from "next/router";
import React, { useEffect } from "react";

const DistributorRegister_NextScreen = () => {
  const router=useRouter();
  return (
    <div className="cpRegister_NextScreen " style={{padding:"30px 250px"}}>
     
        <div
          className="modal-dialog modal-dialog-centered justify-content-center"
          role="document"
        >
          <div className="modal-content border-0 mx-3">
            <div className="modal-body p-0">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header pb-0 bg-white">
                  <div className="row">
                    <div className="col-12">
                      <h5 className="font-weight-bold mt-2 ">
                      Your document verification is currently under process
                      </h5>
                    </div>
                   
                  </div>
                </div>
                <div className="card-body">
                  <p className="text-muted text-left">
                    We will notify you as soon as your documents have been
                    reviewed and approved by our team
                  </p>
                  <img
                    // src="https://i.imgur.com/F5hfOap.jpg"
                     src="/ChannelPartner/cpregister_nextscreen.jpg"
                    className="img-fluid"
                    alt="Document Review"
                    style={{width:"100%", height:"500px"}}
                  />
                  <div className="row justify-content-center">
                  <div className="col-6 text-center">
                      <button
                        type="button"
                        className="btn btn-outline-success btn-block font-weight-bold text-dark mt-3"
                        data-dismiss="modal"
                        onClick={()=>{router.push("/")}}
                      >
                        Got it
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
    </div>
  );
};

export default DistributorRegister_NextScreen;
