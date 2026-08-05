// /*  -----------------uat links------------- */

// export const Baseurl = 'https://crm.saleofast.com/support/api/v1';
// export const filesUrl = 'https://crm.saleofast.com/support/images';

// /*  -----------------iis links------------- */

// export const Baseurl = 'http://crm.cybermatrixsolutions.com/support/api/v1';
// export const filesUrl = 'http://crm.cybermatrixsolutions.com/support/images';

// export const Baseurl = 'http://catalogue.cybermatrixsolutions.com/support/api/v1';
// export const filesUrl = 'http://catalogue.cybermatrixsolutions.com/support/images';


/* -----------------main links------------- */

// export const Baseurl = 'http://localhost:8050/api/v1';
// export const filesUrl = 'http://localhost:8050/images';


// export const Baseurl = 'http://192.168.1.20:8050/api/v1';
// export const filesUrl = 'http://192.168.1.20:8050/images';

/* -----------------NK Realtors links------------- */
// Production
// export const Baseurl = 'https://admin.theprosperity.in/api/v1';
// export const filesUrl = 'https://admin.theprosperity.in/images';

export const Baseurl = 'http://18.61.246.105/api/v1';
export const filesUrl = 'http://18.61.246.105/images';

// Local
// export const Baseurl = 'http://localhost:8050/api/v1';
// export const filesUrl = 'http://localhost:8050/images';

/* RM role id — set per environment in .env (NEXT_PUBLIC_RM_ROLE_ID) */
export const RM_ROLE_ID = Number(process.env.NEXT_PUBLIC_RM_ROLE_ID || 9);

export const isRmRole = (roleId) =>
  roleId !== null &&
  roleId !== undefined &&
  roleId !== "" &&
  Number(roleId) === RM_ROLE_ID;

export const BST_ROLE_ID = 2;

export const isBstRole = (roleId) =>
  roleId !== null &&
  roleId !== undefined &&
  roleId !== "" &&
  Number(roleId) === BST_ROLE_ID;

/** BST profile shows "Activation Date" instead of "Visit Date" */
export const getVisitDateLabel = (roleId, { required = false, possible = false } = {}) => {
  if (isBstRole(roleId)) {
    if (possible) return "Possible Activation Date";
    return required ? "Activation Date*" : "Activation Date";
  }
  if (possible) return "Possible Visit Date";
  return required ? "Visit Date*" : "Visit Date";
};

export const getCpVisitScheduledDate = (item) =>
  item?.follow_up_date || item?.visit_date || item?.createdAt || "";

export const getCpVisitScheduledTime = (item) =>
  item?.follow_up_time || item?.visit_time || "";

export const getCpVisitActivationDate = (item) => {
  if (item?.activation_date) return item.activation_date;
  const verifiedAt =
    item?.visit_verified_at ||
    item?.code_verified_at ||
    item?.visit_code_verified_at ||
    item?.activation_at;
  if (verifiedAt) return String(verifiedAt).split("T")[0];
  if (item?.visit_verified === 1 || item?.visit_verified === true) {
    return item?.updatedAt ? String(item.updatedAt).split("T")[0] : "";
  }
  return "";
};

export const getCpVisitActivationTime = (item) => {
  if (item?.activation_time) return item.activation_time;
  const verifiedAt =
    item?.visit_verified_at ||
    item?.code_verified_at ||
    item?.visit_code_verified_at ||
    item?.activation_at;
  if (verifiedAt && String(verifiedAt).includes("T")) {
    return String(verifiedAt).split("T")[1]?.slice(0, 8) || "";
  }
  return "";
};

export const getCpVisitProjectName = (item, fallback = "") =>
  item?.project_name || item?.sales_project_name || fallback || "";

export const mapCpVisitHistoryItem = (item, fallbackProjectName = "") => ({
  scheduled_date: getCpVisitScheduledDate(item),
  scheduled_time: getCpVisitScheduledTime(item),
  activation_date: getCpVisitActivationDate(item),
  activation_time: getCpVisitActivationTime(item),
  project_name: getCpVisitProjectName(item, fallbackProjectName),
  revisit_date: getCpVisitScheduledDate(item),
  revisit_time: getCpVisitScheduledTime(item),
  remark: [item?.stage || item?.current_stage, item?.remarks || item?.remark]
    .filter(Boolean)
    .join(" - "),
});

