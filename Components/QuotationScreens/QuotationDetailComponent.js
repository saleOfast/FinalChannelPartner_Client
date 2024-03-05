import React from 'react'

const QuotationDetailComponent = ({ head, value }) => {
    
    return (
        <div className="row_wrapper">
            <div className="row">
                <div className="col-xl-6 col-sm-6 col-sm-12 col-12">
                    <div className="head">{head ? head : '------------'}</div>
                </div>
                <div className="col-xl-6 col-sm-6 col-sm-12 col-12">
                    <div className="value">
                        {value ? value : '------------'}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuotationDetailComponent