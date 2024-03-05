import React from 'react'
import LeadShyneIcon from '../Svg/LeadShyneIcon'
import moment from "moment";

const PdfComponent = ({ dataList, loginDetails }) => {
    return (
        <div className='pdfWrapper'>
            {dataList ? <div className='quotation_view'>
                <div className="quat-head">
                    <div className="brand_img">
                        <LeadShyneIcon />
                    </div>
                    <div className="info_sec">
                        <div className="info_line">
                            <div className="head">Registration No</div>
                            <div className="value">: {loginDetails?.user_code}</div>
                        </div>
                        <div className="info_line">
                            <div className="head">Email Id</div>
                            <div className="value">: {loginDetails?.email}</div>
                        </div>
                        <div className="info_line">
                            <div className="head">Website</div>
                            <div className="value">: www.leadshyne.com</div>
                        </div>
                        <div className="info_line">
                            <div className="head">Contact No</div>
                            <div className="value">: {loginDetails?.contact_number}</div>
                        </div>
                    </div>
                </div>
                <div className="quatDtlLine">
                    <div className="lineRow widSixty">
                        <div className="box-inside W33">
                            <div className="head">QUOTATION CODE</div>
                            <div className="value">{dataList?.quatMasterData[0]?.quat_code}</div>
                        </div>
                        <div className="box-inside W33">
                            <div className="head">GENERATE DATE</div>
                            <div className="value">{moment(dataList?.quatMasterData[0]?.createdAt).format("DD-MM-YYYY LT")}</div>
                        </div>
                        <div className="box-inside W33">
                            <div className="head">STATUS</div>
                            <div className="value status">{dataList?.quatMasterData[0]?.quatStatus?.quat_status_name}</div>
                        </div>
                    </div>
                </div>
                <div className="quatDtlLine LineHolder">
                    <div className="lineRow widSixty">
                        <div className="box-inside W33">
                            <div className="head">OWNER NAME</div>
                            <div className="value">{dataList?.quatMasterData[0]?.quatOwner?.user}</div>
                        </div>
                        <div className="box-inside W33">
                            <div className="head">MOBILE NO.</div>
                            <div className="value">{dataList?.quatMasterData[0]?.contact_no}</div>
                        </div>
                        <div className="box-inside W33">
                            <div className="head">EMAIL ID</div>
                            <div className="value">{dataList?.quatMasterData[0]?.email}</div>
                        </div>
                    </div>
                    <div className="lineRow widForty">
                        <div className="box-inside w-50">
                            <div className="head">BILIING ADDRESS</div>
                            <div className="value">{dataList?.quatMasterData[0]?.bill_address}</div>
                        </div>
                        <div className="box-inside w-50">
                            <div className="head">SHIPPING ADDRESS</div>
                            <div className="value">{dataList?.quatMasterData[0]?.ship_address}</div>
                        </div>
                    </div>
                </div>
                <div className="product_sec">
                    <div className="head row">
                        <div className="column col-xl-2 col-md-2 col-sm-2 col-2">SR No.</div>
                        <div className="column col-xl-2 col-md-2 col-sm-2 col-2">PRODUCT ID</div>
                        <div className="column col-xl-2 col-md-2 col-sm-2 col-2">PRODUCT NAME</div>
                        <div className="column col-xl-2 col-md-2 col-sm-2 col-2">QUANTITY</div>
                        <div className="column col-xl-2 col-md-2 col-sm-2 col-2">PRICE</div>
                        <div className="column col-xl-2 col-md-2 col-sm-2 col-2">DISCOUNT</div>
                    </div>
                </div>
                {dataList?.quatProductData?.map((data, i) => {
                    return <div className="productsList" key={i}>
                        <div className="child row">
                            <div className="column col-xl-2 col-md-2 col-sm-2 col-2">{i + 1}</div>
                            <div className="column col-xl-2 col-md-2 col-sm-2 col-2">{data?.p_id}</div>
                            <div className="column col-xl-2 col-md-2 col-sm-2 col-2">{data?.qautProduct?.p_name}</div>
                            <div className="column col-xl-2 col-md-2 col-sm-2 col-2">{data?.qty}</div>
                            <div className="column col-xl-2 col-md-2 col-sm-2 col-2">{data?.price}</div>
                            <div className="column col-xl-2 col-md-2 col-sm-2 col-2">{data?.product_discount}%</div>
                        </div>
                    </div>
                })}
                <div className="tax_sec">
                    <div className="taxesLine">
                        <div className="head">Sub Total</div>
                        <div className="value">{dataList?.quatMasterData[0]?.sub_total}</div>
                    </div>
                    {dataList?.quatSumData?.map((data, i) => {
                        return <div className="taxesLine" key={i}>
                            <div className="head">{data?.tax_name}
                               <span className='texts'> {data?.tax_percentage}% :  </span>
                            </div>
                            <div className="value">{data?.total_amt} </div>
                        </div>
                    })}
                    <div className="taxesLine gtotal">
                        <div className="head">Grand Total</div>
                        <div className="value">{dataList?.quatMasterData[0]?.grand_total}</div>
                    </div>
                </div>
            </div> : null}
        </div>
    )
}

export default PdfComponent