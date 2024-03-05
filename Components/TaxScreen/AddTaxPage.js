import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Baseurl } from "../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { validEmail, validPhone, validZip } from "../../Utils/regex";
import { useSelector } from "react-redux";

const AddTaxPage = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const router = useRouter();
  const { id } = router.query;

  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    tax_name: "",
    tax_type: "",
    tax_percentage: "",
    gts_type: "",
    state_type: "",
    mode: "",
    tax_rate: "",
    description: "",
    row_coloum: "row",
    position: "",
  });


  const getSingleData = async (id) => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id:154
        },
      };
      try {
        const response = await axios.get(
          Baseurl + `/db/tax?t_id=${id}`,
          header
        );
        setUserInfo(response.data.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const submitHandler = async () => {
    if (userInfo.tax_name == "") {
      toast.error("Please enter the tax name");
    } else if (
      userInfo.tax_type == ""
    ) {
      toast.error("Please enter the tax type");
    } else if (userInfo.tax_percentage == "") {
      toast.error("Please enter the tax percentage");
    } else if (userInfo.gts_type == "") {
      toast.error("Please choose gst type");
    } else if (userInfo.state_type == "") {
      toast.error("Please choose the state");
    } else if (userInfo.position == "") {
      toast.error("Please enter the position");
    } else if (userInfo.mode == "") {
      toast.error("Please enter the mode");
    } else if (userInfo.tax_code == "") {
      toast.error("Please enter the tax code");
    }
    else if (userInfo.description == "") {
      toast.error("Please enter the description");
    } else {
      if (hasCookie("token")) {
        let token = getCookie("token");
        let db_name = getCookie("db_name");

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id:153
          },
        };

        try {
          const response = await axios.post(
            Baseurl + `/db/tax`,
            userInfo,
            header
          );
          if (response.status === 204 || response.status === 200) {
            toast.success(response.data.message);
            router.push("/TaxScreen");
          }
        } catch (error) {
          if (error?.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Something went wrong!");
          }
        }
      }
    }
  };


  async function updateHandler() {
    if (userInfo.tax_name == "") {
      toast.error("Please enter the tax name");
    } else if (
      userInfo.tax_type == ""
    ) {
      toast.error("Please enter the tax type");
    } else if (userInfo.tax_percentage == "") {
      toast.error("Please enter the tax percentage");
    } else if (userInfo.gts_type == "") {
      toast.error("Please choose gst type");
    } else if (userInfo.state_type == "") {
      toast.error("Please choose the state");
    } else if (userInfo.position == "") {
      toast.error("Please enter the position");
    } else if (userInfo.mode == "") {
      toast.error("Please enter the mode");
    } else if (userInfo.tax_code == "") {
      toast.error("Please enter the tax code");
    }
    else if (userInfo.description == "") {
      toast.error("Please enter the description");
    } else {
      if (hasCookie("token")) {
        let token = getCookie("token");
        let db_name = getCookie("db_name");

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id:155
          },
        };

        try {
          const response = await axios.put(
            Baseurl + `/db/tax`,
            userInfo,
            header
          );
          if (response.status === 200 || response.status === 204) {
            toast.success(response.data.message);
            router.push("/TaxScreen");
          }
        } catch (error) {
          if (error?.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Something went wrong!");
          }
        }
      }
    }
  }


  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.id) {
      setEditMode(true);
      getSingleData(id);
    }
  }, [router.isReady, id]);

  return (
    <>
       <div className={`main_Box  ${sideView}`}>
        <div className="bread_head">
          <h3 className="content_head">{editMode ? "EDIT" : "ADD"} Tax</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                {" "}
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/TaxScreen"> Manage Tax </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {editMode ? "Edit" : "Add"}
                Tax
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="Add_user_screen">
            <div className="add_screen_head">
              <span className="text_bold">Fill Details</span> ( * Fields are
              mandatory)
            </div>
            <div className="add_user_form">
              <div className="row">
                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="profilelevel">Tax Name *</label>
                    <input
                      type="text"
                      placeholder="Enter Tax Name"
                      name=""
                      id=""
                      className="form-control"
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          tax_name: e.target.value,
                        })
                      }
                      value={userInfo.tax_name ? userInfo.tax_name : ""}
                    />
                  </div>
                </div>
                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="profilelevel">Tax Type *</label>
                    <select
                      name="selectInter"
                      id="selectInter"
                      className="form-control"
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          tax_type: e.target.value,
                        })
                      }
                      value={userInfo.tax_type ? userInfo.tax_type : ""}
                    >
                      <option value="">Select Tax Type </option>
                      <option value="GST">GST </option>
                      <option value="VAT">VAT </option>
                    </select>
                  </div>
                </div>

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="profilelevel">Tax Percentage *</label>
                    <input
                      type="text"
                      placeholder="Enter Percentage"
                      name=""
                      id=""
                      className="form-control"
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          tax_percentage: e.target.value,
                        })
                      }
                      value={
                        userInfo.tax_percentage ? userInfo.tax_percentage : ""
                      }
                    />{" "}
                  </div>
                </div>
                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="profilelevel">Gst Type *</label>
                    <select
                      name="selectInter"
                      id="selectInter"
                      className="form-control"
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          gts_type: e.target.value,
                        })
                      }
                      value={userInfo.gts_type ? userInfo.gts_type : ""}
                    >
                      <option value="">Select </option>
                      <option value="CGST">CGST </option>
                      <option value="UT/SGST">UT/SGST</option>
                      <option value="IGST">IGST</option>
                      <option value="SPCESS">SPCESS</option>
                      <option value="SCCESS">SCCESS</option>
                    </select>
                  </div>
                </div>

                {/*  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="profilelevel">Tax Rate *</label>
                    <select
                      name="selectInter"
                      id="selectInter"
                      className="form-control"
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          tax_rate: e.target.value,
                        })
                      }
                      value={userInfo.tax_rate ? userInfo.tax_rate : ""}
                    >
                      <option value="">Select </option>
                      <option value="CGST">28% </option>
                      <option value="UT/SGST">18%</option>
                      <option value="IGST">12%</option>
                      <option value="SPCESS">5%</option>
                      <option value="SCCESS">0%</option>
                    </select>
                  </div>
                </div> */}

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="selectInter">
                      select Interstate/intrastate *
                    </label>
                    <select
                      name="selectInter"
                      id="selectInter"
                      className="form-control"
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          state_type: e.target.value,
                        })
                      }
                      value={userInfo.state_type ? userInfo.state_type : ""}
                    >
                      <option value="">Select </option>
                      <option value="InterState">InterState </option>
                      <option value="intrastate">Intrastate </option>
                    </select>
                  </div>
                </div>

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="selectInter">
                      Row Postions
                    </label>
                    <select
                      name="selectInter"
                      id="selectInter"
                      className="form-control"
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          position: e.target.value,
                        })
                      }
                      value={userInfo.position ? userInfo.position : ""}
                    >
                      <option value="">Select </option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                </div>
                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="profilelevel">Mode *</label>
                    <input
                      type="text"
                      placeholder="Enter Mode Name"
                      name=""
                      id=""
                      className="form-control"
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          mode: e.target.value,
                        })
                      }
                      value={userInfo.mode ? userInfo.mode : ""}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="descriptions">Description *</label>
                    <textarea
                      className="form-control"
                      placeholder="Enter Description"
                      name="descriptions"
                      id="descriptions"
                      rows="1"
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          description: e.target.value,
                        })
                      }
                      value={userInfo.description ? userInfo.description : ""}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="text-end">
                <div className="submit_btn">
                  {editMode ? (
                    <button className="btn btn-primary" onClick={updateHandler}>
                      Update
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={submitHandler}
                    >
                      Save & Submit
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default AddTaxPage;
