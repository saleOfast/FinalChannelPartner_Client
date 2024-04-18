import React, { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";
import { setCookie } from "cookies-next";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [isShowVerification, setIsShowVerification] = useState(false);
  const [showResetBtn, setShowResetBtn] = useState(false);
  const [timer, setTimer] = useState(30);
  const router = useRouter();

  const resendCode = async () => {
    setCode("");
    setIsShowVerification(false);
    handleSendVerificationCode();
  };

  const handleVerify = async () => {
    if (!email.trim()) {
      toast.error("Please enter email.");
      return;
    }
    if (!code.trim()) {
      toast.error("Please enter code.");
      return;
    }
    try {
      // Make the API request using Axios
      const response = await axios.post(`${Baseurl}/db/users/cp/verify`, {
        email: email.trim(),
        otp: parseInt(code.trim()),
      });
      if (response.data.status == 200) {
        toast.success(response.data.message);
        setCookie('resetPasswordEmail',email);
        router.push("/CHANNEL/ResetPassword/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong.");
    }
  };

  const handleSendVerificationCode = async () => {
    if (!email.trim()) {
      toast.error("Please enter email.");
      return;
    }
    try {
      // Make the API request using Axios
      const response = await axios.post(`${Baseurl}/db/users/cp/send`, {
        email: email.trim(),
      });
      if (response.data.status == 200) {
        toast.success(response.data.message);
        setIsShowVerification(true);
        startTimer();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong.");
    }
  };

  const startTimer = () => {
    setTimer(30);
    setShowResetBtn(false);
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      setShowResetBtn(true);
    }, 30000);
  };

  return (
    <>
      <section className="Sign-In pt-4" style={{ padding: "0 16px" }}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="row d-flex align-items-end">
                <div className="col-7 Sign-In-logo">
                  <img src="/ChannelPartner/logo.png" alt="login" />
                </div>
                <div className="col-5 d-flex justify-content-md-end">
                  <div className="Sign-In_Sign-Up Register">
                    <h3 className="Perfect-Home">Find Your Perfect Home. </h3>
                    <div className="underline" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 d-flex justify-content-center">
              <div className="Sign-In_Sign-Up Register">
                <div className="d-flex">
                  <div className="w-100 new-password p-2">
                    <button
                      type="submit"
                      className="set-password text-white w-100 border-0"
                    >
                      Set New Password
                    </button>
                  </div>
                </div>
                <div className="tab-content pt-4" id="Sign-In-tabContent">
                  <div className="" id="Sign-In-tab">
                    {/* signin-signup-page */}

                    <div className="perfect-home-form pt-1">
                      {/* FORMULAIRE */}
                      <form className="form">
                        <div className="d-flex flex-column gap-1">
                          <label id="user-email" htmlFor="name">
                            Email
                          </label>
                          <input
                            type="email"
                            placeholder="Enter email"
                            className="email mb-0"
                            id="email"
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                          />
                          {isShowVerification && (
                            <span className="text-muted resend-label">
                              Didn’t Receive Code?{" "}
                              {timer > 0 && !showResetBtn && (
                                <span className="resend-text fw-bold">
                                  {timer}
                                </span>
                              )}
                              {showResetBtn && (
                                <span
                                  className="resend-text"
                                  role="button"
                                  onClick={resendCode}
                                >
                                  Resend
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                        {isShowVerification && (
                          <div className="d-flex flex-column gap-1">
                            <label htmlFor="code">Verification Code</label>
                            <input
                              type="text"
                              placeholder="Enter Verification Code"
                              className="code mb-0"
                              id="code"
                              onChange={(e) => {
                                setCode(e.target.value);
                              }}
                            />
                          </div>
                        )}
                      </form>
                      <button
                        type="button"
                        className="login_btn mt-5"
                        onClick={() =>
                          isShowVerification
                            ? handleVerify()
                            : handleSendVerificationCode()
                        }
                      >
                        {isShowVerification
                          ? "Verify"
                          : "Send Verification Code"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
