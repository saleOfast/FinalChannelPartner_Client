// import React, { useState } from 'react';
// import Select from 'react-select';
// import { Table, Button } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

// const MainContent = () => {
//   const [rows, setRows] = useState([{
//     productCategory: null,
//     product: null,
//     box: '',
//     piece: '',
//     quantity: '',
//     price: '',
//     discount: '',
//     tax: '',
//     shipping: '',
//     supplier: '',
//     deliveryDate: '',
//     warranty: ''
//   }]);

//   const productCategories = [
//     { value: 'electronics', label: 'Electronics' },
//     { value: 'furniture', label: 'Furniture' },
//   ];

//   const products = {
//     electronics: [
//       { value: 'laptop', label: 'Laptop' },
//       { value: 'mobile', label: 'Mobile Phone' },
//     ],
//     furniture: [
//       { value: 'sofa', label: 'Sofa' },
//       { value: 'table', label: 'Table' },
//     ],
//   };

//   const handleAddRow = () => {
//     setRows([...rows, {
//       productCategory: null,
//       product: null,
//       box: '',
//       piece: '',
//       quantity: '',
//       price: '',
//       discount: '',
//       tax: '',
//       shipping: '',
//       supplier: '',
//       deliveryDate: '',
//       warranty: ''
//     }]);
//   };

//   const handleRemoveRow = (index) => {
//     const updatedRows = [...rows];
//     updatedRows.splice(index, 1);
//     setRows(updatedRows);
//   };

//   const handleChange = (index, field, value) => {
//     const updatedRows = [...rows];
//     updatedRows[index][field] = value;
//     setRows(updatedRows);
//   };

//   return (
//     <div className="main_content p-3">
//       <div className="table-responsive">
//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>Product Category</th>
//               <th>Product</th>
//               <th>Box</th>
//               <th>Pieces</th>
//               <th>Quantity</th>
//               <th>Price</th>
//               <th>Discount</th>
//               <th>Tax</th>
//               <th>Shipping</th>
//               <th>Supplier</th>
//               <th>Delivery Date</th>
//               <th>Warranty</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((row, index) => (
//               <tr key={index}>
//                 <td style={{ width: "150px" }}>
//                   <Select
//                     options={productCategories}
//                     onChange={(selected) => handleChange(index, 'productCategory', selected)}
//                     value={row.productCategory}
//                     isClearable
//                   />
//                 </td>
//                 <td style={{ width: "150px" }}>
//                   <Select
//                     options={products[row.productCategory?.value] || []}
//                     onChange={(selected) => handleChange(index, 'product', selected)}
//                     value={row.product}
//                     isClearable
//                   />
//                 </td>
//                 {['box', 'piece', 'quantity', 'price', 'discount', 'tax', 'shipping', 'supplier', 'deliveryDate', 'warranty'].map((field) => (
//                   <td key={field} style={{ width: "100px" }}>
//                     <input
//                       type="text"
                      // className="form-control"
//                       value={row[field]}
//                       onChange={(e) => handleChange(index, field, e.target.value)}
//                     />
//                   </td>
//                 ))}
//                 <td style={{ width: "100px" }}>
//                   <Button variant="danger" onClick={() => handleRemoveRow(index)}>Remove</Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//         <Button variant="primary" onClick={handleAddRow}>Add Row</Button>
//       </div>
//     </div>
//   );
// };

// export default MainContent;

import React, { useState } from 'react';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';

const MainContent = () => {
  const [rows, setRows] = useState([
    {
      productCategory: null,
      product: null,
      box: '',
      pieces: '',
      quantity: '',
      price: '',
      discount: '',
      tax: '',
      shipping: '',
      supplier: '',
      deliveryDate: '',
      warranty: '',
    },
  ]);

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
    setRows([
      ...rows,
      {
        productCategory: null,
        product: null,
        box: '',
        pieces: '',
        quantity: '',
        price: '',
        discount: '',
        tax: '',
        shipping: '',
        supplier: '',
        deliveryDate: '',
        warranty: '',
      },
    ]);
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
      <div className="table-responsive pb-5" style={{ overflowX: 'auto' }}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Product Category</th>
              <th>Product</th>
              <th>Box</th>
              <th>Pieces</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Tax</th>
              <th>Shipping</th>
              <th>Supplier</th>
              <th>Delivery Date</th>
              <th>Warranty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td style={{ minWidth: '200px' }}>
                  <Select
                    options={productCategories}
                    value={row.productCategory}
                    onChange={(selectedOption) =>
                      handleChange(index, 'productCategory', selectedOption)
                    }
                    placeholder="Select"
                  />
                </td>
                <td style={{ minWidth: '200px' }}>
                  <Select
                    options={row.productCategory ? products[row.productCategory.value] : []}
                    value={row.product}
                    onChange={(selectedOption) =>
                      handleChange(index, 'product', selectedOption)
                    }
                    placeholder="Select"
                  />
                </td>
                {['box', 'pieces', 'quantity', 'price', 'discount', 'tax', 'shipping', 'supplier', 'warranty'].map((field) => (
                  <td key={field}>
                    <input
                      type="text"
                      className="form-control"
                      style={{ minWidth: '150px' }} // Set a minimum width for inputs
                      value={row[field]}
                      onChange={(e) => handleChange(index, field, e.target.value)}
                    />
                  </td>
                ))}
                <td>
                  <input
                    type="date"
                    className="form-control"
                    value={row.deliveryDate}
                    onChange={(e) => handleChange(index, 'deliveryDate', e.target.value)}
                  />
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleRemoveRow(index)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-primary mb-3" onClick={handleAddRow}>
          + Add Row
        </button>
      </div>
    </div>
  );
};

export default MainContent;