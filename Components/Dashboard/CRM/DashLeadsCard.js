import React from 'react'

const DashLeadsCard = ({ head, price, date, img }) => {
    return (
        <>
         <div className="dash_card d-flex flex-column align-start gap-2">
                <div className="detail_sec">
                    <div className="head_text" style={{fontSize:"14px"}}>{head}</div>
                </div>
                <div className=" d-flex justify-content-between align-items-center">
                <div className="price">{price}</div>
                <div className='image_sec'>
                    <img src={img} alt="card-img" />
                </div>
                </div>
                <div className="date">
                <div className="date">{date}</div>
                </div>
            </div>

            {/* <div className="dash_card">
                <div className="detail_sec">
                    <div className="head_text">{head}</div>
                    <div className="price">{price}</div>
                    <div className="date">{date}</div>
                </div>
                <div className="image_sec">
                    <img src={img} alt="card-img" />
                </div>
            </div> */}
        </>
    )
}

export default DashLeadsCard