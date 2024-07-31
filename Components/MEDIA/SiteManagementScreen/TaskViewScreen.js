import React, { useEffect, useState } from "react";

import PlusIcon from "../Svg/PlusIcon";
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import { Baseurl } from "../../Utils/Constants";
import ConfirmBox from "../Basics/ConfirmBox";
import TaskDetailComponent from "./TaskDetailComponent";
import Button from "react-bootstrap/Button";
import moment from "moment";
import { useSelector } from "react-redux";

const TaskViewScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const router = useRouter();
  const { id } = router.query;

  const [dataList, setDataList] = useState({});
  const [disableShowConfirm, setdisableShowConfirm] = useState(false);

  const getDataList = async (id) => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 14,
        },
      };

      try {
        const response = await axios.get(
          Baseurl + `/db/tasks?t_id=${id}`,
          header
        );
        setDataList(response.data.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.id) {
      getDataList(id);
    }
  }, [router.isReady, id]);

  return (
    <>
      {/*  <ConfirmBox
                showConfirm={disableShowConfirm}
                setshowConfirm={setdisableShowConfirm}
                actionType={disableHandler}
                title={"Are You Sure you want to Disable ?"}
            /> */}

       <div className={`main_Box  ${sideView}`}>
        <div className="bread_head">
          <h3 className="content_head">VIEW TASK</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/TaskScreen">Home </Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/TaskScreen">View Task </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Task
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="lead_box">
            <div className="row">
              <div className="col-xl-8 col-md-8 col-sm-12 col-12">
                <div className="lead-info ">
                  <div className="header">View Task</div>
                  <div className="info_boxes">
                    <TaskDetailComponent
                      head="Task Name"
                      value={dataList?.task_name}
                    />
                    <TaskDetailComponent
                      head="Task Status"
                      value={dataList?.db_task_status?.task_status_name}
                    />
                    <TaskDetailComponent
                      head="Task Priority"
                      value={dataList?.db_task_priority?.task_priority_name}
                    />
                    <TaskDetailComponent
                      head="Due Date"
                       value={moment(dataList?.due_date).format("DD-MM-YYYY ")}
                    
                    />
                    <TaskDetailComponent
                      head="Link With Leads"
                      value={dataList?.db_lead?.lead_name}
                    />
                    <TaskDetailComponent
                      head="Link With Opportunity"
                      value={dataList?.linkWithOpportunity?.opp_name}
                    />
                    <TaskDetailComponent
                      head="Description"
                      value={dataList?.description}
                    />
                  </div>

                  <div className="header dashboard_head">
                    System Information
                  </div>
                  <div className="info_boxes">
                    <TaskDetailComponent
                      head="Created On"
                      value={moment(dataList?.createdAt).format("DD-MM-YYYY LT")}
                    />
                    <TaskDetailComponent
                      head="Last Modified On"
                      value={moment(dataList?.updateon).format("DD-MM-YYYY LT")}
                    />
                    <div className="btn-box text-end pb-4 pt-2">
                    <Link href={`/AddTask?id=${id}`}>
                      <button className="btn btn-primary">Edit</button>
                    </Link>
                  </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskViewScreen;
