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

