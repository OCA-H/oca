'use client';

import React from 'react';

export const Header: React.FC = () => {
  return (
    <header>
      <div className="wrap topbar">
        <a href="#top" className="brand">
          <img 
            className="header-logo-img" 
            src="/images/oca-header-logo.jpg" 
            alt="Old Columbans Association" 
          />
        </a>
    
        <nav className="primary-nav" aria-label="Primary">
          <div className="nav-item">
            <span className="nav-link" data-nav="about">About OCA <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6"/></svg></span>
            <div className="dropdown">
              <a href="#/vision-mission">Our Mission &amp; Objectives</a>
              <a href="#/executive-committee">Executive Committee</a>
              <a href="https://www.oldcolumban.net/batch-coordinator/">Batch Coordinators</a>
              <a href="https://www.oldcolumban.net/cause-list-grid/">OCA Social Conscience</a>
              <a href="https://www.oldcolumban.net/bylaws/">ByLaws of OCA</a>
            </div>
          </div>
          <div className="nav-item">
            <span className="nav-link" data-nav="events">Events <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6"/></svg></span>
            <div className="dropdown">
              <a href="https://www.oldcolumban.net/oca-annual-lunch-get-together/">OCA – Annual Lunch Get Together</a>
              <a href="https://www.oldcolumban.net/oca-sports-event/">OCA Sports</a>
              <a href="https://www.oldcolumban.net/platinum-jubilee-lunch/">Gallery</a>
              <a href="https://www.oldcolumban.net/school-anthem/">School Anthem</a>
              <a href="https://www.stcolumbas.edu.in/about-school.aspx">History of the School</a>
              <a href="https://www.stcolumbas.edu.in/about-our-principal.aspx">School Principals</a>
              <a href="https://www.oldcolumban.net/school-magazine/">School Magazine</a>
              <a href="https://www.oldcolumban.net/events-photographs/">Photographs</a>
            </div>
          </div>
          <div className="nav-item">
            <span className="nav-link" data-nav="directory">Directory <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6"/></svg></span>
            <div className="dropdown">
              <a href="https://www.oldcolumban.net/find-your-batchmates/">Find Your Batchmates</a>
              <a href="https://www.oldcolumban.net/worldwide-chapters-office-bearers/">Worldwide Chapters &amp; Office Bearers</a>
            </div>
          </div>
          <div className="nav-item">
            <span className="nav-link" data-nav="connect">OCA Connect <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6"/></svg></span>
            <div className="dropdown">
              <a href="https://www.oldcolumban.net/columbans-profiles-of-success-achievements/">News Makers</a>
              <a href="https://www.oldcolumban.net/alumni-services/">Alumni Services</a>
              <a href="https://www.oldcolumban.net/career-networking/">Careers</a>
              <a href="https://www.oldcolumban.net/networking/">Networking</a>
              <a href="https://www.oldcolumban.net/apprenticeship-interns/">OCA Internships Program</a>
              <a href="https://www.oldcolumban.net/oca-newsletter/">Newsletters</a>
              <a href="https://www.oldcolumban.net/remembrance/">Remembrance</a>
            </div>
          </div>
          <div className="nav-item">
            <span className="nav-link" data-nav="membership">Membership <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6"/></svg></span>
            <div className="dropdown">
              <a href="#/membership">Become a Member</a>
              <a href="https://www.oldcolumban.net/members-2/">As an OCA Member</a>
              <a href="https://www.oldcolumban.net/partner-organization/">As a Partner Organization</a>
            </div>
          </div>
        </nav>
    
        <div className="header-actions">
          <a className="btn btn-gold btn-sm" href="#/donation">Contribute</a>
          <a className="btn btn-primary btn-sm" href="#/membership">Become a Member</a>
          <div className="nav-item signin-item">
            <button className="icon-btn" type="button">Sign In <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6"/></svg></button>
            <div className="dropdown dropdown-right">
              <a href="https://www.oldcolumban.net/members-2/">As an OCA Member</a>
              <a href="https://www.oldcolumban.net/partner-organization/">As a Partner Organization</a>
            </div>
          </div>
          <button className="burger" aria-label="Open menu">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
