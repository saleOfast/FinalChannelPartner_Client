import React, { useState } from 'react';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

const MainContent = ({ viewMode }) => {
  const [rows, setRows] = useState([{ productCategory: null, product: null, box: '', piece: '', quantity: '', price: '', discount: '', tax: '', shipping: '', supplier: '', deliveryDate: '', warranty: '' }]);

  const productCategories = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
  ];

  const products = {
    electronics: [
      { value: 'laptop', label: 'Laptop' },
      { value: 'mobile', label: 'Mobile Phone' },
    ],
    furniture: [
      { value: 'sofa', label: 'Sofa' },
      { value: 'table', label: 'Table' },
    ],
  };

  const handleAddRow = () => {
    setRows([...rows, { productCategory: null, product: null, box: '', piece: '', quantity: '', price: '', discount: '', tax: '', shipping: '', supplier: '', deliveryDate: '', warranty: '' }]);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  

  return (
    <div className="main_content p-3">
      <div className="table_screen">
        {/* Responsive table container */}
        <div className="table-responsive mt-2" style={{ overflowX: 'auto' }}>
          <table className="table table-bordered table-striped" style={{ minWidth: '1500px', whiteSpace: 'nowrap' }}>
            <thead className="thead-dark">
              <tr>
                <th>Product Category</th>
                <th>Product</th>
                <th>Box</th>
                <th>Piece</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Tax</th>
                <th>Shipping</th>
                <th>Supplier</th>
                <th>Delivery Date</th>
                <th>Warranty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <Select
                      value={row.productCategory}
                      onChange={(selected) => handleChange(index, 'productCategory', selected)}
                      options={productCategories}
                      placeholder="Select Category"
                      isDisabled={viewMode}
                    />
                  </td>
                  <td>
                    <Select
                      value={row.product}
                      onChange={(selected) => handleChange(index, 'product', selected)}
                      options={products[row.productCategory?.value] || []}
                      placeholder="Select Product"
                      isDisabled={viewMode}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.box}
                      onChange={(e) => handleChange(index, 'box', e.target.value)}
                      className="form-control"
                      placeholder="Box Count"
                      disabled={viewMode}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.piece}
                      onChange={(e) => handleChange(index, 'piece', e.target.value)}
                      className="form-control"
                      placeholder="Piece Count"
                      disabled={viewMode}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                      className="form-control"
                      placeholder="Quantity"
                      disabled={viewMode}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) => handleChange(index, 'price', e.target.value)}
                      className="form-control"
                      placeholder="Price"
                      disabled={viewMode}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.discount}
                      onChange={(e) => handleChange(index, 'discount', e.target.value)}
                      className="form-control"
                      placeholder="Discount"
                      disabled={viewMode}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.tax}
                      onChange={(e) => handleChange(index, 'tax', e.target.value)}
                      className="form-control"
                      placeholder="Tax"
                      disabled={viewMode}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.shipping}
                      onChange={(e) => handleChange(index, 'shipping', e.target.value)}
                      className="form-control"
                      placeholder="Shipping"
                      disabled={viewMode}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.supplier}
                      onChange={(e) => handleChange(index, 'supplier', e.target.value)}
                      className="form-control"
                      placeholder="Supplier"
                      disabled={viewMode}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={row.deliveryDate}
                      onChange={(e) => handleChange(index, 'deliveryDate', e.target.value)}
                      className="form-control"
                      disabled={viewMode}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.warranty}
                      onChange={(e) => handleChange(index, 'warranty', e.target.value)}
                      className="form-control"
                      placeholder="Warranty"
                      disabled={viewMode}
                    />
                  </td>
                  <td>
                    <div className="d-flex justify-content-center">
                      {index === rows.length - 1 && (
                        <button type="button" className="btn btn-primary" onClick={handleAddRow}>
                          +
                        </button>
                      )}
                      {index > 0 && (
                        <button type="button" className="btn btn-danger" onClick={() => handleRemoveRow(index)}>
                          -
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style jsx>{`
        .main_content {
          padding: 20px;
          background-color: #f8f9fa;
        }
        .table-responsive {
          overflow-x: auto;
          margin-top: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          padding: 10px;
          background-color:#343a40;
          color:#fff;
          border-bottom: 1px solid #dee2e6;
        }
        td {
          padding: 10px;
          border-bottom: 1px solid #dee2e6;
        }
        button {
          margin-right: 5px;
          color:#fff;
        }
        button:first-of-type {
          background-color:#007bff; /* Primary */
        }
        button:last-of-type {
          background-color:#dc3545; /* Danger */
        }
      `}</style>
    </div>
  );
};

export default MainContent;
