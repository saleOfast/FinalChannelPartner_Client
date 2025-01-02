import { getCookie, hasCookie } from 'cookies-next';
import MUIDataTable from 'mui-datatables';
import React from 'react'

export const OpenReport = () => {
      const clientBtnColor=hasCookie("clientBtnColor") ? getCookie("clientBtnColor") : "#293790"
    
      const columns = [
        {
          name: 'visit_id',
          label: "C.P Name",
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
              label: "Date",
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
              label: "Project Name",
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
              label: "Remarks",
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
                          title={"Open Report"}
                          data={[]}
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
