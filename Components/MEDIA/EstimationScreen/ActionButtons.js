import React from "react";
import Link from "next/link";
import { Dropdown } from "react-bootstrap";

const ActionButtons = ({
  value,
  tableMeta,
  openConfirmBox,
  accept_rejectApproval,
  sentForApproval,
  setEstimationId,
  getState,
  setShow,
  setShow5,
  setShowVendorAsset,
  setShow3,
  setShow4,
  setShow6,
  setShowVendorAgency,
  setShowSalesOrder,
  setShowPurchaseOrder,
  mediaSidebarInfo,
  busiessTypeList,
  userInfo,
  estimateApprovals,
}) => {
  const isNewOrReopen = tableMeta.rowData[3] === "New" || tableMeta.rowData[3] === "Reopen";
  const isApproved = tableMeta.rowData[3] === "Approved";
  const isDB = userInfo?.isDB;

  const isAsset =
    busiessTypeList.find(
      (item) => item.cmpn_b_t_id === tableMeta.rowData[2]
    )?.cmpn_b_t_name === "Asset";

  const isAgency =
    busiessTypeList.find(
      (item) => item.cmpn_b_t_id === tableMeta.rowData[2]
    )?.cmpn_b_t_name === "Agency";

  const items = [];

  // Asset and Agency specific conditions
  if (
    (isAsset && isNewOrReopen) || (isAgency && isNewOrReopen)
  ) {
    items.push(
      <Dropdown.Item
        key="offer-site"
        onClick={() => {
          setEstimationId(tableMeta?.rowData[4]);
          getState();
          setShow(true);
        }}
        title="Offer Site"
      >
        Offer Site
      </Dropdown.Item>
    );
  }

  // Send For Approval condition
  if (isNewOrReopen || isDB) {
    items.push(
      <Dropdown.Item
        key="send-for-approval"
        onClick={() => {
          sentForApproval(value);
        }}
        title="Send For Approval"
      >
        Send For Approval
      </Dropdown.Item>
    );
  }

  // Additional conditions for Sales and Purchase Orders
  items.push(
    <Dropdown.Item
      key="sales-order"
      onClick={() => {
        setEstimationId(tableMeta?.rowData[4]);
        setShowSalesOrder(true);
      }}
      title="Sales Order"
    >
      Sales Order
    </Dropdown.Item>
  );

  items.push(
    <Dropdown.Item
      key="purchase-order"
      onClick={() => {
        setEstimationId(tableMeta?.rowData[4]);
        setShowPurchaseOrder(true);
      }}
      title="Purchase Order"
    >
      Purchase Order
    </Dropdown.Item>
  );

  return (
    <div className="table_btns">

      {mediaSidebarInfo[0]?.children?.find((item) => item?.menu_id == 433)?.children[0]?.children[8]?.actions === 1 &&
        estimateApprovals?.indexOf(userInfo?.role_id) !== -1 &&
        tableMeta.rowData[3] === "Sent For Approval" && (
          <>
            <button className="action_btn" title="Accept" onClick={() => accept_rejectApproval(value, "true")}>
              <AcceptIcon />
            </button>
            <button className="action_btn" title="Reject" onClick={() => accept_rejectApproval(value, "false")}>
              <RejectIcon />
            </button>
          </>
        )}

      {items.length > 0 && (
        <Dropdown>
          <Dropdown.Toggle
            style={{ height: "26px", width: "26px", borderRadius: "3px" }}
            className="d-flex justify-content-center align-items-center"
            title="More Actions"
          >
          </Dropdown.Toggle>
          <Dropdown.Menu>{items}</Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
};

export default ActionButtons;
