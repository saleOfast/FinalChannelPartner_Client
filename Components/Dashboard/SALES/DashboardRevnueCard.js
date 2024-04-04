import React from 'react'

const DashboardRevnueCard = ({ head, price, date, img }) => {
    return (
        <>
            <div className="dash_card">
                <div className="detail_sec">
                    <div className="head_text">{head}</div>
                    <div className="price">&#8377; {price}</div>
                    <div className="date">{date}</div>
                </div>
                <div className="image_sec">
                    <img src={img} alt="card-img" />
                </div>
            </div>
        </>
    )
}

export default DashboardRevnueCard