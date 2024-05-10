import React, { useEffect, useState } from "react";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl } from "../../../../Utils/Constants";
import Link from "next/link";

const Top5Leads = ({ dataList,name }) => {
    return (
        <div className="task_card mt-4">
            <div className="task_head">{name}</div>

            <div className="tasks_details">
                <ul className="tasks_list">
                    {dataList?.topFiveLeads?.map((lead, i) => {
                        return (
                            <li key={lead?.lead_id} className="list-item">
                                <div className="opp_box">
                                    <div className="name">{lead?.lead_name}</div>
                                    <div className="price"> {lead?.createdAt.split("T")[0]}</div>
                                </div>
                            </li>

                        );
                    })}
                </ul>
            </div>
            <div className="card_footer">
                <Link href='/Opportunity'>
                    <div className="text_more">view more</div>
                </Link>
            </div>
        </div>
    )
}

export default Top5Leads