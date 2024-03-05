import React from 'react'

const DashLeadsCard = ({ head, price, date, img }) => {
    return (
        <>
            <div className="dash_card">
                <div className="detail_sec">
                    <div className="head_text">{head}</div>
                    <div className="price">{price}</div>
                    <div className="date">{date}</div>
                </div>
                <div className="image_sec">
                    <img src={img} alt="card-img" />
                </div>
            </div>
        </>
    )
}

export default DashLeadsCard