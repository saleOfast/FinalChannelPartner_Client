import React, { useEffect, useState } from "react";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl } from "../../../../Utils/Constants";
import Link from "next/link";
import { Modal, Table } from "react-bootstrap";


const Top5Visits = ({ dataList,name }) => {
  const [show, setShow] = useState(false);
  const downloadCSV = () => {
    const csvRows = [];
    const headers = ["Name", "Number"];
    csvRows.push(headers.join(",")); // Add headers

    dataList?.topFiveVisits?.forEach((visit) => {
      const row = [visit?.user, visit?.visitCount];
      csvRows.push(row.join(",")); // Add each row
    });

    // Create a Blob from the CSV rows
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    
    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${name}.csv`);
    
    // Append to the body and trigger click
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  };
    return (
        <div className="task_card mt-4">
            <div className="task_head">{name}</div>

            <div className="tasks_details">
                <ul className="tasks_list">
                    {dataList?.topFiveVisits?.slice(0,5)?.map((visit, i) => {
                        return (
                            <li key={i} className="list-item">
                                <div className="opp_box">
                                    <div className="name">{visit?.user}</div>
                                    <div className="price"> {visit?.visitCount}</div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
                <div className="card_footer">
            <div className="text_more" onClick={() => setShow(true)}>
            View more
            </div>

            <Modal
            show={show}
            onHide={() => {
                setShow(false);
            }}
            size=""
            >
            <Modal.Header closeButton>
                <Modal.Title>{name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Scrollable table container */}
                <div style={{ height: "270px", overflowY: "auto" }}>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Number</th>
                    </tr>
                    </thead>
                    <tbody>
                    {dataList?.topFiveVisits?.map((visit, index) => (
                        <tr key={index}>
                        <td>{visit?.user}</td>
                        <td>{visit?.visitCount}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                </div>
                <button onClick={downloadCSV} className="btn btn-primary mt-3 float-end">
                    Download CSV
                </button>
            </Modal.Body>
            </Modal>
        </div>
        </div>
    )
}

export default Top5Visits