
import React, { useEffect, useState } from "react";
import PlusIcon from '../Svg/PlusIcon';
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";
import Link from "next/link";


const TasksCard = ({ dataList }) => {

    return (
        <>
            <div className="task_card">
                <div className="task_head">Tasks</div>

                <div className="tasks_details">
                    <div className="btn-box">
                        <Link href={`/AddTask`}>
                            <button className='btn btn-primary'> <PlusIcon /> Add task </button>
                        </Link>
                    </div>
                    <ol type='number' className="tasks_list">
                        {dataList?.latestTasks?.map(({ task_name, days_left }, i) => {
                            return (
                                <li key={i} className="list-item">
                                    <div className="task_box">
                                        <div className="task">{task_name}  </div>
                                        <div className={days_left && days_left >= 0 ? 'green days_left' : 'days_left red'}>
                                            {days_left + " days due"}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </div>
                <div className="card_footer">
                    <Link href='/TaskScreen'>  <div className="text_more">view more</div></Link>
                </div>
            </div>
        </>
    )
}

export default TasksCard