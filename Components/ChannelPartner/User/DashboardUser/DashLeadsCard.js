import React from 'react'

const DashLeadsCard = ({ head, price, date, img, color, icon }) => {
    function hexToRgb(hex) {
        if (!hex) return "0, 0, 0"; // Default black if no color provided
        // Remove the '#' if present
        hex = hex.replace("#", "");
      
        // Parse hex to integer values for R, G, B
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
      
        return `${r}, ${g}, ${b}`;
      }
      const DynamicIcon = icon
    return (
        <>
        <div className="dash_card d-flex flex-column align-start gap-2">
        <div className="detail_sec">
          {/* <div className="head_text" style={{ fontSize: "14px" }}>

            <span>
              <span
                style={{
                  background: color ?? "",
                  opacity: 0.1,
                  borderRadius: "50%",
                  padding: "6px",
                  marginRight: color ? "7px" : "0px"
                }}
              >
                {color && (
                  <LocalFireDepartmentIcon
                    sx={{ fontSize: 20, color: color, opacity: 1 }}
                    style={{ fontSize: "20px", color: `${color}`, opacity: 1 }}
                  />
                )}
              </span>
              <span>{head}</span>
            </span>

          </div> */}
          <div className="head_text" style={{ fontSize: "14px" }}>
            <span className='d-flex items-center'>
             
              <span
                style={{
                  background: color ? `rgba(${hexToRgb(color)}, 0.2)` : "rgba(221, 221, 221, 0.3)",
                  borderRadius: "50%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px",
                  marginRight: "7px",
                }}
              >
                {DynamicIcon &&<DynamicIcon
                  sx={{ fontSize: 20, color: `rgba(${hexToRgb(color)}, 1.5)`}}
                  style={{ fontSize: "20px", color: `rgba(${hexToRgb(color)}, 1.5)`}}
                />}
              </span>
              <span>{head}</span>
            </span>
          </div>

        </div>
        <div className=" d-flex justify-content-between align-items-center">
          <div className="price" style={{marginLeft:"16px"}}>{price}</div>
          {/* <div className='image_sec'>
                    <img src={img} alt="card-img" />
                </div> */}
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