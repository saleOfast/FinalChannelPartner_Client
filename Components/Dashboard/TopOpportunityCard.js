import React, { useEffect, useState } from "react";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";
import Link from "next/link";

const TopOpportunityCard = ({ dataList }) => {
    return (
        <div className="task_card">
            <div className="task_head">Top 5 Opportunities</div>

            <div className="tasks_details">
                <ul className="tasks_list">
                    {dataList?.topOpportunities?.map(({ opp_id, opp_name, amount }, i) => {
                        return (
                            <li key={opp_id} className="list-item">
                                <div className="opp_box">
                                    <div className="name">{opp_name}</div>
                                    <div className="price">&#8377; {amount}</div>
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

export default TopOpportunityCard