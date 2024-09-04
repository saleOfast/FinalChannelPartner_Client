import React from 'react';
import { Modal, Table, Button } from 'react-bootstrap';

const VisitHistoryModel = ({ show, setShow, visitHistory }) => {
    function formatTime(timeString) {
        const timeParts = (timeString || '').split(':');
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
      
        const date = new Date(2000, 0, 1, hours, minutes);
      
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }
      
    function formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
    }

    const visitHistorys = [
        { revisit_date: '2024-09-04', revisit_time: '15:35:00', remark: 'Consultation' },
        { revisit_date: '2024-09-05', revisit_time: '15:35:00', remark: 'Annual review' },
        { revisit_date: '2024-09-01', revisit_time: '15:35:00', remark: 'First visit' },
        { revisit_date: '2024-09-02', revisit_time: '15:35:00', remark: 'Follow-up visit' },
        { revisit_date: '2024-09-03', revisit_time: '15:35:00', remark: 'Routine check-up' },
    ];

    // Function to download the table data as CSV
    const downloadCSV = () => {
        const csvRows = [];
        // Headers
        csvRows.push(['SN', 'Revisit Date', 'Revisit Time', 'Remark'].join(','));

        // Data Rows
        visitHistorys.forEach((visit, index) => {
            const row = [
                index + 1,
                formatDate(visit.revisit_date),
                formatTime(visit.revisit_time),
                visit.remark
            ];
            csvRows.push(row.join(','));
        });

        // Create a Blob from the CSV data
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        // Create a link element and trigger a download
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'visit_history.csv');
        a.click();

        // Clean up the URL object
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <Modal
                show={show}
                onHide={() => setShow(false)}
                size="xl"
                top
            >
                <Modal.Header closeButton>
                    <Modal.Title>Revisits History</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>SN</th>
                                <th>Revisit Date</th>
                                <th>Revisit Time</th>
                                <th>Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visitHistory.length > 0 ? (
                                visitHistory.map((visit, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{visit?.revisit_date ? formatDate(visit?.revisit_date) : ""}</td>
                                        <td>{visit?.revisit_time ? formatTime(visit?.revisit_time) : ""}</td>
                                        <td>{visit?.remark ? visit?.remark : ""}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        No visit history available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    {/* <Button variant="primary" onClick={downloadCSV}>
                        Download CSV
                    </Button> */}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default VisitHistoryModel;