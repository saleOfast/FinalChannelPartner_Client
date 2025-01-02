import { getCookie, hasCookie } from 'cookies-next';
import MUIDataTable from 'mui-datatables';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Baseurl } from '../../../../Utils/Constants';
import axios from 'axios';
import Link from 'next/link';

export const BookingReport = (startDate) => {
      console.log({startDate})
      const[loader,setLoader]=useState(false);
      const [dataList, setDataList] = useState([])
      const clientBtnColor=hasCookie("clientBtnColor") ? getCookie("clientBtnColor") : "#293790"
      const getDataList = async (queryObjLeads) => {
        setLoader(true)
        let url = `/db/channel/booking`;
        
          if (hasCookie('token')) {
              let token = (getCookie('token'));
              let db_name = (getCookie('db_name'));
  
              let header = {
                  headers: {
                      Accept: "application/json",
                      Authorization: "Bearer ".concat(token),
                      db: db_name,
                      m_id: 76,
                  }
              }
  
              try {
                  const response = await axios.get(Baseurl + url, {
                    ...header,
                    params: {
                      f_date: queryObjLeads?.startDate,
                      t_date: queryObjLeads?.endDate
                  },
                  });
                  if(response?.status === 200 || response?.status === 201){
                    setLoader(false)
                    setDataList(response.data.data);
                  }
              } catch (error) {
                  if (error?.response?.data?.message) {
                    setLoader(false)
                      toast.error(error?.response?.data?.message,{autoClose:2500});
                  } else {
                    setLoader(false)
                      toast.error("Something went wrong!",{autoClose:2500});
                  }
              }
          }
      }
  useEffect(()=>{
              if(startDate){
                getDataList(startDate?.dateFilter, startDate?.dateFilter)
              }
              else{
                getDataList()
              }
            },[startDate])
      const columns = [
         
          {
              name: 'leadDataProject',
              label: "Booking Date",
              options: {
                  filter: false,
                  customHeadRender: (columnMeta, updateDirection) => (
                    <th className="text-center" style={{background:clientBtnColor? clientBtnColor:`#293790`, color: 'white',padding:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                  customBodyRender: (value, tableMeta, updateValue) => {
                      return (
                          <div className='status_box' style={{color:"#667799"}}>
                              {/* {value?.projectData?.project} */}
                              {value}
                          </div>
                      )
                  }
              }
          },
          {
            name: 'booking_code',
            label: "Booking ID",
            options: {
              filter: false,
              customHeadRender: (columnMeta, updateDirection) => (
                <th className="text-center" style={{background:clientBtnColor? clientBtnColor:`#293790`, color: 'white',padding:"15px"}}   >
                  {columnMeta.label}
                </th>
              ),
              customBodyRender: (value, tableMeta, updateValue) => {
                return (
                  <div className='status_box fw-bold' style={{ color: "#293790" }} >
                    {value}
                  </div>
                )
              }
      
            }
          },
          {
            name: 'booking_name',
            label: "Booking Name",
            options: {
              filter: false,
              customHeadRender: (columnMeta, updateDirection) => (
                <th className="text-center" style={{background:clientBtnColor? clientBtnColor:`#293790`, color: 'white',padding:"15px"}}   >
                  {columnMeta.label}
                </th>
              ),
              customBodyRender: (value, tableMeta, updateValue) => {
                return (
                  <Link href={`/partner/BookingDetails?booking_id=${tableMeta?.rowData[0]}`} className='status_box fw-bold text-decoration-underline' style={{ color: "#293790" }}>
                    {value}
                  </Link>
                )
              }
            },
      
          },
          {
            name: 'email',
            label: "Email",
            options: {
              filter: false,
              customHeadRender: (columnMeta, updateDirection) => (
                <th className="text-center" style={{background:clientBtnColor? clientBtnColor:`#293790`, color: 'white',padding:"15px"}}   >
                  {columnMeta.label}
                </th>
              ),
              customBodyRender: (value, tableMeta, updateValue) => {
      
                return (
                  <div className='status_box fw-bold' style={{ color: "#293790" }}>
                    {value}
                  </div>
                )
              }
      
            }
          },
          {
            name: 'contact_no',
            label: "Contact No.",
            options: {
              filter: false,
              customHeadRender: (columnMeta, updateDirection) => (
                <th className="text-center" style={{background:clientBtnColor? clientBtnColor:`#293790`, color: 'white',padding:"15px"}}   >
                  {columnMeta.label}
                </th>
              ),
              customBodyRender: (value, tableMeta, updateValue) => {
                return (
                  <div className='status_box' style={{ color: "#667799" }}>
                    +91-{value}
                  </div>
                )
              }
            }
          },
          {
            name: 'BookingprojectData',
            label: "Project",
            options: {
              filter: false,
              customHeadRender: (columnMeta, updateDirection) => (
                <th className="text-center" style={{background:clientBtnColor? clientBtnColor:`#293790`, color: 'white',padding:"15px"}}   >
                  {columnMeta.label}
                </th>
              ),
              customBodyRender: (value, tableMeta, updateValue) => {
                return (
                  <div className='status_box' style={{ color: "#667799" }}>
                    {/* {value?.project} */}
                    {value}
                  </div>
                )
              }
            }
          },
          {
            name: 'Location',
            label: "Location",
            options: {
              filter: true,
              customHeadRender: (columnMeta, updateDirection) => (
                <th className="text-center" style={{background:clientBtnColor? clientBtnColor:`#293790`, color: 'white',padding:"15px"}}   >
                  {columnMeta.label}
                </th>
              ),
              customBodyRender: (value, tableMeta, updateValue) => {
                return (
                  <div className='status_box' style={{ color: "#667799" }}>
                    {value}
                  </div>
                )
              }
            }
          },
          {
            name: 'visit_id',
            label: "Booking ID",
            options: {
              display:false,
                filter: false,
                download:false,
                viewColumns:false,
                customHeadRender: (columnMeta, updateDirection) => (
                  <th className="text-center" style={{background:clientBtnColor? clientBtnColor:`#293790`, color: 'white',padding:"15px"}}   >
                    {columnMeta.label}
                  </th>
                ),
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div  className='status_box fw-bold' style={{color:"#293790"}} >
                            {value}
                        </div>
                    )
                }
                  
            }
        },
            {
                name: 'visit_code',
                label: "C.P Name",
                options: {
                    filter: false,
                    customHeadRender: (columnMeta, updateDirection) => (
                      <th className="text-center" style={{background:clientBtnColor? clientBtnColor:`#293790`, color: 'white',padding:"15px"}}   >
                        {columnMeta.label}
                      </th>
                    ),
                      customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <div  className='status_box fw-bold' style={{color:"#293790"}} >
                                {value}
                            </div>
                        )
                    }
                      
                }
            },
            {
                name: 'leadDataName',
                label: "Contacted",
                options: {
                    filter: false,
                    customHeadRender: (columnMeta, updateDirection) => (
                      <th className="text-center" style={{background:clientBtnColor? clientBtnColor:`#293790`, color: 'white',padding:"15px"}}   >
                        {columnMeta.label}
                      </th>
                    ),
                      customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <Link href={`/partner/VisitDetails?id=${tableMeta?.rowData[0]}`}  className='status_box fw-bold text-decoration-underline' style={{color:"#293790"}}>
                                {/* {value.lead_name} */}
                                {value}
                            </Link>
                        )
                    }
                },
    
            },
            {
                name: 'leadDataEmail',
                label: "Brokerage Status",
                options: {
                    filter: false,
                    customHeadRender: (columnMeta, updateDirection) => (
                      <th className="text-center" style={{background:clientBtnColor? clientBtnColor:`#293790`, color: 'white',padding:"15px"}}   >
                        {columnMeta.label}
                      </th>
                    ),
                      customBodyRender: (value, tableMeta, updateValue) => {
                        
                        return (
                            <div className='status_box fw-bold' style={{color:"#293790"}}>
                                {/* {value.email_id} */}
                                {value}
                            </div>
                        )
                    }
                    
                }
            },
            {
                name: 'leadDataContact',
                label: "Brokerage Bill",
                options: {
                    filter: false,
                    customHeadRender: (columnMeta, updateDirection) => (
                      <th className="text-center" style={{background:clientBtnColor? clientBtnColor:`#293790`, color: 'white',padding:"15px"}}   >
                        {columnMeta.label}
                      </th>
                    ),
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <div className='status_box' style={{color:"#667799"}}>
                                {/* +91-{value.p_contact_no} */}
                                +91-{value}
                            </div>
                        )
                    }
                }
            },
      ];
    
    const options = {
        enableNestedDataAccess: ".",
        selectableRows: 'none',
        responsive: "standard",
        // onRowSelectionChange : handleRowClick,
        // onRowsDelete: handleDelete,
        downloadOptions:{filename:"ChannelPartnerList"},
        // enableNestedDataAccess:".",
        // filterType:'multiselect',
        viewColumns: true,
    };

  return (
   <>
      <div className="miuiTable channelTable">
                      <MUIDataTable
                          title={"Booking Report"}
                          data={dataList}
                          // data={mappedDataList}
                          columns={columns}
                          // options={options}
                          options={{
                              ...options,
                              customFilterDialogFooter: () => (
                                <div
                                  style={{
                                    minWidth: "400px", // Set consistent width
                                  }}
                                />
                              ),
                            }}
                      />
                   
                  </div>
   </>
  )
}
