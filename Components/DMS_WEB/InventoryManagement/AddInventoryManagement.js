import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Baseurl, filesUrl } from "../../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import moment from "moment";
import { useSelector } from "react-redux";
import { fetchData } from "../../../Utils/getReq";
import Select from "react-select";
import MainContent from "./MainContent";



const AddInventoryManagement = () => {
  const router = useRouter();
  const { id } = router.query;
  const sideView = useSelector((state) => state.sideView.value);
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const userInfo=hasCookie("userInfo") ? JSON.parse(getCookie("userInfo")) :null


  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.id) {
      setEditMode(true);
      // getSingleData(id);
    }
    if (router.query.vw) [setViewMode(true)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, id]);
 
  return (
    <div className={`main_Box  ${sideView}`}>
      <div className="bread_head">
        <h3 className="content_head">
          {viewMode ? "VIEW" : <>{editMode ? "EDIT" : "ADD"}</>} INVENTORY
        </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item fw-bolder">
              {" "}
              <Link href="/dms">Home</Link>
            </li>
            <li className="breadcrumb-item fw-bolder">
              <Link href="/dms/InventoryManagement"> Inventory List </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {viewMode ? "View" : <> {editMode ? "Edit" : "Add"}</>}{" "}
              Inventory
            </li>
          </ol>
        </nav>
      </div>
      
      <MainContent
          viewMode={viewMode}
          editMode={editMode}
          setViewMode={setViewMode}
          setEditMode={setEditMode}
      />
    </div>
  );
};

export default AddInventoryManagement;
