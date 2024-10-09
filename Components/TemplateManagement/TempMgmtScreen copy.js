import React, { useEffect, useState } from "react";

import PlusIcon from "../Svg/PlusIcon";
import Link from "next/link";
import { toast } from "react-toastify";
import { hasCookie, getCookie } from "cookies-next";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";
import { useRouter } from "next/router";
import ConfirmBox from "../Basics/ConfirmBox";
import { useSelector } from "react-redux";
import {
  Editor,
  EditorProvider,
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnStrikeThrough,
  BtnLink,
  BtnNumberedList,
  BtnRedo,
  BtnUnderline,
  BtnUndo,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import Select from "react-select";

const TempMgmtScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);
  const [selectedApp, setSelectedApp] = useState("");
  const [html, setHtml] = useState();
  const [templateList, setTemplateList] = useState([]);
  const [templateId, setTemplateId] = useState();
  const [loading, setLoading] = useState(false);

  const allowedpermissions = hasCookie("allowedpermissions")
    ? JSON.parse(getCookie("allowedpermissions"))
    : null;

  function onChange(e) {
    setHtml(e.target.value);
  }

  const getTemplateList = async () => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          pass: "pass",
        },
      };
      try {
        const idMap = { crm: 1, dms: 2, channel: 4, media: 5 };
        const id = idMap[selectedApp] || "";
        const response = await axios.get(
          `${Baseurl}/db/emailTemplates/getEmailTemplates?platform_id=${id}`,
          header
        );
        if (response?.status == 200 || response?.status == 201) {
          setTemplateList(response?.data?.data);
        }
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  useEffect(() => {
    if (selectedApp) getTemplateList();
  }, [selectedApp]);

  useEffect(() => {
    if (templateId) {
      const data = templateList?.find(
        (item) => item?.template_id == templateId
      );
      setHtml(data?.template);
    }
  }, [templateId]);

  const handleUpdate = async () => {
    if (hasCookie("token")) {
      setLoading(true);
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          pass: "pass",
        },
      };

      try {
        const id = templateId;
        const response = await axios.put(
          Baseurl + `/db/emailTemplates/updateEmailTemplates`,
          {
            template_id: id,
            template: html,
          },
          header
        );
        if (response.status === 200 || response.status === 204) {
          toast.success(response?.data?.message);
          setLoading(false);
          // setHtml()
          // setSelectedApp()
          // setTemplateId()
          setTemplateList();
          getTemplateList();
        }
      } catch (error) {
        setLoading(false);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  return (
    <>
      <div className={`main_Box  ${sideView}`}>
        <div className="bread_head">
          <h3 className="content_head">TEMPLATE MANAGEMENT</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                {" "}
                <Link href="/setting">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Template Management
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content p-2">
          <div className="table_screen d-flex mb-2">
            <div
              className="col-xl-3 col-md-3 col-sm-3 col-3"
              style={{ marginLeft: "20px" }}
            >
              <div className="">
                <Select
                  id="select_option"
                  placeholder="App"
                  isDisabled={loading}
                  value={allowedpermissions?.map((item) => {
                    if (item == selectedApp) {
                      return {
                        value: item,
                        label: item.toUpperCase(),
                      };
                    }
                  })}
                  options={allowedpermissions?.map((item) => {
                    return {
                      value: item,
                      label: item.toUpperCase(),
                    };
                  })}
                  onChange={(e) => {
                    setTemplateId();
                    setHtml();
                    setSelectedApp(e.value);
                  }}
                />
              </div>
            </div>
            <div
              className="col-xl-3 col-md-3 col-sm-3 col-3"
              style={{ marginLeft: "20px" }}
            >
              <div className="">
                <Select
                  id="select_option"
                  placeholder="Template"
                  isDisabled={loading}
                  value={templateList?.map((item) => {
                    if (item?.template_id == templateId) {
                      return {
                        label: item?.template_name,
                        value: item?.template_id,
                      };
                    }
                  })}
                  options={templateList?.map((item) => {
                    return {
                      label: item?.template_name,
                      value: item?.template_id,
                    };
                  })}
                  onChange={(e) => {
                    setTemplateId(e.value);
                  }}
                />
              </div>
            </div>
            {selectedApp && templateId && (
              <div className="top_btn_sec ">
                <button
                  className="btn btn-primary Add_btn ms-3 p-2"
                  onClick={() => {
                    handleUpdate();
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      &nbsp;Update
                    </>
                  ) : (
                    "Update"
                  )}
                </button>
              </div>
            )}
          </div>
          {selectedApp && templateId && (
            <EditorProvider>
              <Editor value={html} onChange={onChange}>
                <Toolbar>
                  <BtnBold />
                  <BtnItalic />
                  <BtnBulletList />
                  <BtnClearFormatting />
                  <BtnStrikeThrough />
                  <BtnLink />
                  <BtnNumberedList />
                  <BtnRedo />
                  <BtnUnderline />
                  <BtnUndo />
                  {/* <BtnStyles/>          */}
                  <Separator />
                </Toolbar>
              </Editor>
            </EditorProvider>
          )}
        </div>
      </div>
    </>
  );
};

export default TempMgmtScreen;
