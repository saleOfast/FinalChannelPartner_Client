import React from 'react'

const Kloudmart = () => {
  return (
    <section className="kloudmart">
    <div className="container">
      <div className="d-flex align-items-center gap-2">
        <button className="toggle_btn"><i className="fa-solid fa-bars" /></button>
        <a href="#"><img src="./DMS_IMAGES/kloudmart.png"  className /></a>
      </div>
      <div className="d-flex gap-3">
        <img src="./DMS_IMAGES/notification.png"  />
        <img src="./DMS_IMAGES/Profile.png"  />
      </div>
    </div>
  </section>
  )
}

export default Kloudmart