export const DMPCArray = [
  {
    label: "Display Selling Cost",
    id: "display_selling_cost",
    fieldType: "currency",
  },
  {
    label: "Mounting Selling Cost",
    id: "mounting_selling_cost",
    fieldType: "currency",
  },
  {
    label: "Printing Selling Cost",
    id: "printing_selling_cost",
    fieldType: "currency",
  },
  {
    label: "Total Selling Cost",
    id: "total_selling_cost",
    fieldType: "currency",
  },
  {
    label: "Display Buying Cost",
    id: "display_buying_cost",
    fieldType: "currency",
  },
  {
    label: "Mounting Buying Cost",
    id: "mounting_buying_cost",
    fieldType: "currency",
  },
  {
    label: "Printing Buying Cost",
    id: "printing_buying_cost",
    fieldType: "currency",
  },
  {
    label: "Total Buying Cost",
    id: "total_buying_cost",
    fieldType: "currency",
  },
];

export const additionalInfoArray = [
  {
    label: "Sales Order Value",
    id: "sales_order_value",
    fieldType: "currency",
  },
  {
    label: "Sales Order Value without Tax",
    id: "sales_order_value_without_tax",
    fieldType: "currency",
  },
  { label: "Invoice Value", id: "invoice_value", fieldType: "currency" },
  {
    label: "Purchase Order Value",
    id: "purchase_order_value",
    fieldType: "currency",
  },
  {
    label: "Receipt from Customer Value",
    id: "receipt_from_customer_value",
    fieldType: "currency",
  },
  {
    label: "Client Outstanding",
    id: "client_outstanding",
    fieldType: "currency",
  },
  {
    label: "Credit Note Value",
    id: "credit_note_value",
    fieldType: "currency",
  },
  { label: "Debit Note Value", id: "debit_note_value", fieldType: "currency" },
  {
    label: "Vendor Payment Value",
    id: "vendor_payment_value",
    fieldType: "currency",
  },
  { label: "Total NDP Days", id: "total_ndp_days", fieldType: "number" },
  { label: "Total NDP Value", id: "total_ndp_value", fieldType: "currency" },
  {
    label: "Vendor Outstanding",
    id: "vendor_outstanding",
    fieldType: "currency",
  },
];

export const TotalCostArray1 = [
  {
    label: "Total Client Cost without Tax",
    id: "total_client_cost_without_tax",
    fieldType: "currency",
  },
  { label: "Client Tax", id: "client_tax", fieldType: "currency" },
  {
    label: "Total Client Cost with Tax",
    id: "total_client_cost_with_tax",
    fieldType: "currency",
  },
];

export const TotalCostArray2 = [
  {
    label: "Total Vendor Cost without Tax",
    id: "total_vendor_cost_without_tax",
    fieldType: "currency",
  },
  { label: "Vendor Tax", id: "vendor_tax", fieldType: "currency" },
  {
    label: "Total Vendor Cost with Tax",
    id: "total_vendor_cost_with_tax",
    fieldType: "currency",
  },
];

export const marginInfoArray = [
  { label: "Overall Margin", id: "overall_margin", fieldType: "currency" },
  { label: "Display Margin", id: "display_margin", fieldType: "currency" },
  { label: "Mounting Margin", id: "mounting_margin", fieldType: "currency" },
  { label: "Printing Margin", id: "printing_margin", fieldType: "currency" },
  {
    label: "Overall Margin %",
    id: "overall_margin_percentage",
    fieldType: "percentage",
  },
  {
    label: "Display Margin %",
    id: "display_margin_percentage",
    fieldType: "percentage",
  },
  {
    label: "Mounting Margin %",
    id: "mounting_margin_percentage",
    fieldType: "percentage",
  },
  {
    label: "Printing Margin %",
    id: "printing_margin_percentage",
    fieldType: "percentage",
  },
];

export const formaArray = [
  {
    label: "Site Code",
    name: "site_id",
    type: "number",
    disabled: true,
  },
  { label: "State", name: "state", disabled: true, type: "text" },
  { label: "City", name: "city", disabled: true, type: "text" },
  {
    label: "Location",
    name: "location",
    disabled: true,
    type: "text",
  },
  {
    label: "Category",
    name: "category",
    disabled: true,
    type: "text",
  },
  {
    label: "Media Format",
    name: "media_format",
    disabled: true,
    type: "text",
  },
  {
    label: "Media Vehicle",
    name: "media_vehicle",
    disabled: true,
    type: "text",
  },
  {
    label: "Media Type",
    name: "media_type",
    disabled: true,
    type: "text",
  },
  {
    label: "Quantity",
    name: "quantity",
    type: "text",
    disabled: true,
  },
  {
    label: "Width (Ft.)",
    name: "width",
    type: "text",
    disabled: true,
  },
  {
    label: "Height (Ft.)",
    name: "height",
    type: "text",
    disabled: true,
  },
  {
    label: "Total (Sq. Ft.)",
    name: "total_sq_ft",
    type: "text",
    disabled: true,
  },
  {
    label: "Campaign Start Date",
    name: "campaign_start_date",
    type: "date",
    disabled: true,
  },
  {
    label: "Campaign End Date",
    name: "campaign_end_date",
    type: "date",
    disabled: true,
  },
  {
    label: "Campaign Duration",
    name: "campaign_duration",
    disabled: true,
    type: "text",
  },
  {
    label: "Display Vendor Name",
    name: "display_vender_cost",
    disabled: true,
    type: "text",
  },
  {
    label: "Display Cost / Month",
    name: "display_cost_per_month",
    disabled: true,
    type: "text",
  },
  {
    label: "Buying Price as Per Duration",
    name: "buying_price_as_per_duration",
    disabled: true,
    type: "text",
  },
  {
    label: "Final Display Cost",
    name: "final_display_cost",
    type: "number",
  },
  {
    label: "Mounting Vendor",
    name: "mounting_vendor_id",
    type: "select",
  },
  {
    label: "Mounting Cost / Sq. Ft.",
    name: "mounting_cost_per_sq_ft",
    type: "number",
  },
  {
    label: "Mounting Cost",
    name: "mounting_cost",
    disabled: true,
    type: "number",
  },
  {
    label: "Printing Vendor",
    name: "printing_vendor_id",
    type: "select",
  },
  {
    label: "Printing Material",
    name: "pr_m_id",
    type: "select",
  },
  {
    label: "Printing Cost / Sq. Ft.",
    name: "printing_cost_per_sq_ft",
    type: "number",
  },
  {
    label: "Printing Cost",
    name: "printing_cost",
    disabled: true,
    type: "number",
  },
  { label: "Remarks", name: "remarks" },
];

export const updateClientCostAssetArray = [
  { label: "Site Code", name: "site_id", type: "number", disabled: true },
  { label: "State", name: "state", disabled: true },
  { label: "City", name: "city", disabled: true },
  { label: "Location", name: "location", disabled: true },
  { label: "Category", name: "category", disabled: true },
  { label: "Media Format", name: "media_format", disabled: true },
  { label: "Media Vehicle", name: "media_vehicle", disabled: true },
  { label: "Media Type", name: "media_type", disabled: true },
  { label: "Quantity", name: "quantity", type: "number" },
  { label: "Width (Ft.)", name: "width", type: "number" },
  { label: "Height (Ft.)", name: "height", type: "number" },
  {
    label: "Total (Sq. Ft.)",
    name: "total_sq_ft",
    type: "text",
    disabled: true,
  },
  { label: "Campaign Start Date", name: "campaign_start_date", type: "date" },
  { label: "Campaign End Date", name: "campaign_end_date", type: "date" },
  { label: "Campaign Duration", name: "campaign_duration", disabled: true },
  {
    label: "Display Cost / Month",
    name: "display_cost_per_month",
    disabled: true,
  },
  {
    label: "Selling Price as per Duration",
    name: "selling_price_as_per_duration",
    disabled: true,
  },
  {
    label: "Final Client PO Cost",
    name: "final_client_po_cost",
    type: "number",
  },
  {
    label: "Mounting Cost / Sq. Ft.",
    name: "mounting_cost_per_sq_ft",
    type: "number",
  },
  { label: "Mounting Cost", name: "mounting_cost", disabled: true },
  {
    label: "Printing Cost / Sq. Ft.",
    name: "printing_cost_per_sq_ft",
    type: "number",
  },
  { label: "Printing Cost", name: "printing_cost", disabled: true },
  { label: "Remarks", name: "remarks" },
];

export const updateClientCostAgencyArray = [
  { label: "Site Code", name: "site_id", type: "number", disabled: true },
  { label: "State", name: "state", disabled: true },
  { label: "City", name: "city", disabled: true },
  { label: "Location", name: "location", disabled: true },
  // { label: 'Category', name: 'category', disabled: true },
  { label: "Media Format", name: "media_format", disabled: true },
  { label: "Media Vehicle", name: "media_vehicle", disabled: true },
  { label: "Media Type", name: "media_type", disabled: true },
  { label: "Quantity", name: "quantity", type: "number" },
  { label: "Width (Ft.)", name: "width", type: "number" },
  { label: "Height (Ft.)", name: "height", type: "number" },
  {
    label: "Total (Sq. Ft.)",
    name: "total_sq_ft",
    type: "text",
    disabled: true,
  },
  { label: "Campaign Start Date", name: "campaign_start_date", type: "date" },
  { label: "Campaign End Date", name: "campaign_end_date", type: "date" },
  { label: "Campaign Duration", name: "campaign_duration", disabled: true },
  {
    label: "Display Cost / Month",
    name: "display_cost_per_month",
    disabled: true,
  },
  {
    label: "Selling Price as per Duration",
    name: "selling_price_as_per_duration",
    disabled: true,
  },
  {
    label: "Final Client PO Cost",
    name: "final_client_po_cost",
    type: "number",
  },
  {
    label: "Mounting Cost / Sq. Ft.",
    name: "mounting_cost_per_sq_ft",
    type: "number",
  },
  { label: "Mounting Cost", name: "mounting_cost", disabled: true },
  {
    label: "Printing Cost / Sq. Ft.",
    name: "printing_cost_per_sq_ft",
    type: "number",
  },
  { label: "Printing Cost", name: "printing_cost", disabled: true },
  { label: "Remarks", name: "remarks" },
];

export const formaArray1 = [
  {
    label: "Site Code",
    name: "site_id",
    type: "number",
    disabled: true,
  },
  { label: "State", name: "state", disabled: true, type: "text" },
  { label: "City", name: "city", disabled: true, type: "text" },
  {
    label: "Location",
    name: "location",
    disabled: true,
    type: "text",
  },
  // {
  //   label: "Category",
  //   name: "category",
  //   disabled: true,
  //   type: "text",
  // },
  {
    label: "Media Format",
    name: "media_format",
    disabled: true,
    type: "text",
  },
  {
    label: "Media Vehicle",
    name: "media_vehicle",
    disabled: true,
    type: "text",
  },
  {
    label: "Media Type",
    name: "media_type",
    disabled: true,
    type: "text",
  },
  {
    label: "Quantity",
    name: "quantity",
    type: "text",
    disabled: true,
  },
  {
    label: "Width (Ft.)",
    name: "width",
    type: "text",
    disabled: true,
  },
  {
    label: "Height (Ft.)",
    name: "height",
    type: "text",
    disabled: true,
  },
  {
    label: "Total (Sq. Ft.)",
    name: "total_sq_ft",
    type: "text",
    disabled: true,
  },
  {
    label: "Campaign Start Date",
    name: "campaign_start_date",
    type: "date",
    disabled: true,
  },
  {
    label: "Campaign End Date",
    name: "campaign_end_date",
    type: "date",
    disabled: true,
  },
  {
    label: "Campaign Duration",
    name: "campaign_duration",
    disabled: true,
    type: "text",
  },
  {
    label: "Display Vendor Name",
    name: "display_vender_cost",
    disabled: true,
    type: "text",
  },
  {
    label: "Display Cost / Month",
    name: "display_cost_per_month",
    disabled: true,
    type: "text",
  },
  {
    label: "Buying Price as Per Duration",
    name: "buying_price_as_per_duration",
    disabled: true,
    type: "text",
  },
  {
    label: "Final Display Cost",
    name: "final_display_cost",
    type: "number",
  },
  {
    label: "Mounting Vendor",
    name: "mounting_vendor_id",
    type: "select",
  },
  {
    label: "Mounting Cost / Sq. Ft.",
    name: "mounting_cost_per_sq_ft",
    type: "number",
  },
  {
    label: "Mounting Cost",
    name: "mounting_cost",
    disabled: true,
    type: "number",
  },
  {
    label: "Printing Vendor",
    name: "printing_vendor_id",
    type: "select",
  },
  {
    label: "Printing Material",
    name: "pr_m_id",
    type: "select",
  },
  {
    label: "Printing Cost / Sq. Ft.",
    name: "printing_cost_per_sq_ft",
    type: "number",
  },
  {
    label: "Printing Cost",
    name: "printing_cost",
    disabled: true,
    type: "number",
  },
  { label: "Remarks", name: "remarks" },
];
