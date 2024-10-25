import React from 'react';
import Table from 'react-bootstrap/Table';

const JobCardManagement = () => {
  // Dummy data for the tables
  const jobRequests = [
    {
      requestId: 'D001',
      requestDate: '2024-10-25',
      requestType: 'Display',
      vendorCode: 'V001',
      vendorName: 'Vendor A',
      campaignStartDate: '2024-11-01',
      siteId: 'S001',
      siteState: 'CA',
      siteCity: 'Los Angeles',
      siteLocation: '123 Main St',
      widthFt: 10,
      heightFt: 5,
      quantity: 100,
      totalPayout: 5000,
    },
    {
      requestId: 'M001',
      requestDate: '2024-10-25',
      requestType: 'Mounting',
      vendorCode: 'V002',
      vendorName: 'Vendor B',
      campaignStartDate: '2024-11-05',
      siteState: 'NY',
      siteCity: 'New York',
      siteLocation: '456 Elm St',
      widthFt: 12,
      heightFt: 6,
      quantity: 50,
      totalSqFt: 72,
      perSqFtCost: 20,
      totalPayout: 1440,
    },
    {
      requestId: 'P001',
      requestDate: '2024-10-25',
      requestType: 'Printing',
      vendorCode: 'V003',
      vendorName: 'Vendor C',
      printingMaterial: 'Vinyl',
      campaignStartDate: '2024-11-10',
      siteState: 'TX',
      siteCity: 'Houston',
      siteLocation: '789 Oak St',
      widthFt: 15,
      heightFt: 8,
      quantity: 200,
      totalSqFt: 1200,
      perSqFtCost: 10,
      totalPayout: 12000,
    },
  ];

  // Filter job requests by type
  const displayRequests = jobRequests.filter(req => req.requestType === "Display");
  const mountingRequests = jobRequests.filter(req => req.requestType === "Mounting");
  const printingRequests = jobRequests.filter(req => req.requestType === "Printing");

  return (
    <div className=''>
      <div className="add_screen_head">
        <span className="text_bold">Job Card Management</span>
      </div>

      {/* Display Table */}
      <div className="add_user_form">
            <div className="row">
                 <span className="text_bold mb-2">Display Requests</span>
                 <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Request Date</th>
            <th>Vendor Code</th>
            <th>Vendor Name</th>
            <th>Campaign Start Date</th>
            <th>Site ID</th>
            <th>Site State</th>
            <th>Site City</th>
            <th>Site Location</th>
            <th>Width (Ft.)</th>
            <th>Height (Ft.)</th>
            <th>Quantity</th>
            <th>Total Payout</th>
          </tr>
        </thead>
        <tbody>
          {displayRequests.map((request, index) => (
            <tr key={index}>
              <td>{request.requestId}</td>
              <td>{request.requestDate}</td>
              <td>{request.vendorCode}</td>
              <td>{request.vendorName}</td>
              <td>{request.campaignStartDate}</td>
              <td>{request.siteId || '-'}</td>
              <td>{request.siteState}</td>
              <td>{request.siteCity}</td>
              <td>{request.siteLocation}</td>
              <td>{request.widthFt}</td>
              <td>{request.heightFt}</td>
              <td>{request.quantity}</td>
              <td>{request.totalPayout}</td>
            </tr>
          ))}
        </tbody>
      </Table>
            </div>
      </div>
      
      <div className="add_user_form">
            <div className="row">
                 <span className="text_bold mb-2">Mounting Requests</span>
                 <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Request Date</th>
            <th>Vendor Code</th>
            <th>Vendor Name</th>
            <th>Campaign Start Date</th>
            <th>Site ID</th>
            <th>Site State</th>
            <th>Site City</th>
            <th>Site Location</th>
            <th>Width (Ft.)</th>
            <th>Height (Ft.)</th>
            <th>Quantity</th>
            <th>Total Payout</th>
          </tr>
        </thead>
        <tbody>
          {mountingRequests.map((request, index) => (
            <tr key={index}>
              <td>{request.requestId}</td>
              <td>{request.requestDate}</td>
              <td>{request.vendorCode}</td>
              <td>{request.vendorName}</td>
              <td>{request.campaignStartDate}</td>
              <td>{request.siteId || '-'}</td>
              <td>{request.siteState}</td>
              <td>{request.siteCity}</td>
              <td>{request.siteLocation}</td>
              <td>{request.widthFt}</td>
              <td>{request.heightFt}</td>
              <td>{request.quantity}</td>
              <td>{request.totalPayout}</td>
            </tr>
          ))}
        </tbody>
      </Table>
            </div>
      </div>

      <div className="add_user_form">
            <div className="row">
                 <span className="text_bold mb-2">Printing Requests</span>
                 <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Request Date</th>
            <th>Vendor Code</th>
            <th>Vendor Name</th>
            <th>Campaign Start Date</th>
            <th>Site ID</th>
            <th>Site State</th>
            <th>Site City</th>
            <th>Site Location</th>
            <th>Width (Ft.)</th>
            <th>Height (Ft.)</th>
            <th>Quantity</th>
            <th>Total Payout</th>
          </tr>
        </thead>
        <tbody>
          {printingRequests.map((request, index) => (
            <tr key={index}>
              <td>{request.requestId}</td>
              <td>{request.requestDate}</td>
              <td>{request.vendorCode}</td>
              <td>{request.vendorName}</td>
              <td>{request.campaignStartDate}</td>
              <td>{request.siteId || '-'}</td>
              <td>{request.siteState}</td>
              <td>{request.siteCity}</td>
              <td>{request.siteLocation}</td>
              <td>{request.widthFt}</td>
              <td>{request.heightFt}</td>
              <td>{request.quantity}</td>
              <td>{request.totalPayout}</td>
            </tr>
          ))}
        </tbody>
      </Table>
            </div>
      </div>

     

    </div>
  );
};

export default JobCardManagement;