import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { filesUrl } from '../../../Utils/Constants';
import { getCookie } from 'cookies-next';

const CP_NavBar = () => {
  const router = useRouter();

  const clientLogo= getCookie('clientLogo')? getCookie('clientLogo') : null;
  console.log("clientLogo",clientLogo)

  const isActive = (pathname) => {
    return router.pathname === pathname ? 'active' : '';
  };

  return (
    <>
      <section className="Reports-Dashboard bg-white" >
        <nav className="navbar navbar-expand-lg navbar-light " style={{ borderTop: '1px solid #F5F5F5', borderBottom: '1px solid #F5F5F5' }}>
          <div className="container-fluid mx-3">
            <div className="navbar-brand" >
              <img src={`${filesUrl}`+`/logo/images${clientLogo}`} alt="" style={{ height: 66 }} />
              {/* <img src="/ChannelPartner/logo.png" alt="" style={{ height: 48 }} /> */}
              </div>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex gap-2">
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/')}`} href="/">Reports &amp; Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/CHANNEL/ActivePartners')}`} href="/CHANNEL/ActivePartners">Channel Partners</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/CHANNEL/PendingRequests')}`} href="/CHANNEL/PendingRequests">Pending Requests</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/CHANNEL/ChannelProfile')}`} href="/CHANNEL/ChannelProfile">Profile</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </section>
    </>
  );
};

export default CP_NavBar;
