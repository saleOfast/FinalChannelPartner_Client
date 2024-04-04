import React from 'react'

const PendingPayments = () => {
  return (
    <section className="shop_by_category">
    <div className="container">
      <div className="shop_by">
        <div className="text-wrapper-12">Pending Payments</div>
        <div className="text-wrapper-13">See All</div>
      </div>
      <div className="row pt-3">
        <div className="col-6">
          <div className="group-29">
            <div className="group-wrapper">
              <div className="group-28 d-flex flex-column gap-2">
                <div className="text-wrapper-26">Order ID: DL295750293018</div>
                <div className="order-date-amount">
                  <p className="order-date-jan">
                    <span className="text-wrapper-31">Order Date: </span> <span className="span">15 Jan 2024</span>
                  </p>
                  <p className="order-amount mb-0">
                    <span className="text-wrapper-27">Order Amount: </span>
                    <span className="text-wrapper-28">₹</span>
                    <span className="text-wrapper-30">53800</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="group-27">
            <div className="group-wrapper">
              <div className="group-28 d-flex flex-column gap-2">
                <div className="text-wrapper-26">Order ID: DL295750293018</div>
                <div className="order-date-amount">
                  <p className="order-date-jan">
                    <span className="text-wrapper-31">Order Date: </span> <span className="span">15 Jan 2024</span>
                  </p>
                  <p className="order-amount mb-0">
                    <span className="text-wrapper-27">Order Amount: </span>
                    <span className="text-wrapper-28">₹</span>
                    {/* <span class="text-wrapper-29">&nbsp;</span> */}
                    <span className="text-wrapper-30">53800</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default PendingPayments