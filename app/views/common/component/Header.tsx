'use client';

import React, { useState } from 'react';

export const Header: React.FC = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
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
                <div className="dropdown-soon"><span>Batch Coordinators</span><span className="soon-tag">Coming soon</span></div>
                <div className="dropdown-soon"><span>OCA Social Conscience</span><span className="soon-tag">Coming soon</span></div>
                <div className="dropdown-soon"><span>Teachers Benevolent Fund</span><span className="soon-tag">Coming soon</span></div>
                <div className="dropdown-soon"><span>ByLaws of OCA</span><span className="soon-tag">Coming soon</span></div>
              </div>
            </div>
            <div className="nav-item">
              <span className="nav-link" data-nav="events">Events <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6"/></svg></span>
              <div className="dropdown">
                <a href="#/annual-dinner">OCA – Annual Dinner Get Together</a>
                <a href="#/annual-lunch">OCA – Annual Lunch Get Together</a>
                <a href="#/sports">OCA Sports</a>
                <div className="has-flyout">
                  <span className="fly-label" tabIndex={0} role="button" aria-haspopup="true">
                    Gallery 
                    <svg viewBox="0 0 8 12" fill="none" aria-hidden="true"><path d="M1.5 1l5 5-5 5" stroke="currentColor" strokeWidth="1.6" /></svg>
                  </span>
                  <div className="flyout">
                    <div className="dropdown-soon"><span>School Anthem</span><span className="soon-tag">Coming soon</span></div>
                    <div className="dropdown-soon"><span>History of the School</span><span className="soon-tag">Coming soon</span></div>
                    <div className="dropdown-soon"><span>School Principals</span><span className="soon-tag">Coming soon</span></div>
                    <div className="dropdown-soon"><span>School Magazine</span><span className="soon-tag">Coming soon</span></div>
                    <div className="dropdown-soon"><span>Photographs</span><span className="soon-tag">Coming soon</span></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="nav-item">
              <span className="nav-link" data-nav="directory">Directory <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6"/></svg></span>
              <div className="dropdown">
                <div className="dropdown-soon"><span>Find Your Batchmates</span><span className="soon-tag">Coming soon</span></div>
                <div className="dropdown-soon"><span>Worldwide Chapters &amp; Office Bearers</span><span className="soon-tag">Coming soon</span></div>
              </div>
            </div>
            <div className="nav-item">
              <span className="nav-link" data-nav="connect">OCA Connect <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6"/></svg></span>
              <div className="dropdown">
                <div className="dropdown-soon"><span>News Makers</span><span className="soon-tag">Coming soon</span></div>
                <div className="dropdown-soon"><span>Alumni Services</span><span className="soon-tag">Coming soon</span></div>
                <div className="dropdown-soon"><span>Careers</span><span className="soon-tag">Coming soon</span></div>
                <div className="dropdown-soon"><span>Networking</span><span className="soon-tag">Coming soon</span></div>
                <div className="dropdown-soon"><span>OCA Internships Program</span><span className="soon-tag">Coming soon</span></div>
                <div className="dropdown-soon"><span>Newsletters</span><span className="soon-tag">Coming soon</span></div>
                <div className="dropdown-soon"><span>Remembrance</span><span className="soon-tag">Coming soon</span></div>
              </div>
            </div>
            <div className="nav-item">
              <span className="nav-link" data-nav="membership">Membership <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6"/></svg></span>
              <div className="dropdown">
                <a href="#/membership">Become a Member</a>
                <a href="#/member-signin">As an OCA Member</a>
                <div className="dropdown-soon"><span>As a Partner Organization</span><span className="soon-tag">Coming soon</span></div>
              </div>
            </div>
          </nav>
      
          <div className="header-actions">
            <a className="btn btn-gold btn-sm" href="#/donation">Contribute</a>
            <a className="btn btn-primary btn-sm" href="#/membership">Become a Member</a>
            <div className="nav-item signin-item">
              <button className="icon-btn" type="button">Sign In <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6"/></svg></button>
              <div className="dropdown dropdown-right">
                <a href="#/member-signin">As an OCA Member</a>
                <div className="dropdown-soon"><span>As a Partner Organization</span><span className="soon-tag">Coming soon</span></div>
              </div>
            </div>
            <button className="burger" aria-label="Open menu" onClick={() => setMobileNavOpen(true)}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer scrim and navigation */}
      <div 
        className={`mobile-scrim ${mobileNavOpen ? 'open' : ''}`} 
        onClick={() => setMobileNavOpen(false)} 
      />
      <div className={`mobile-nav ${mobileNavOpen ? 'open' : ''}`} id="mobileNav">
        <div className="mobile-nav-head">
          <span className="brand-text" style={{ color: 'var(--navy)' }}>
            <strong style={{ fontFamily: 'var(--serif)', fontSize: '17px' }}>Old Columbans</strong>
          </span>
          <button 
            onClick={() => setMobileNavOpen(false)}
            style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--navy)' }}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <a className="top" href="#/vision-mission" onClick={() => setMobileNavOpen(false)}>About OCA</a>
        <a className="sub" href="#/vision-mission" onClick={() => setMobileNavOpen(false)}>Our Mission &amp; Objectives</a>
        <a className="sub" href="#/executive-committee" onClick={() => setMobileNavOpen(false)}>Executive Committee</a>
        <span className="sub sub-soon">Batch Coordinators<span className="soon-tag">Soon</span></span>
        <span className="sub sub-soon">OCA Social Conscience<span className="soon-tag">Soon</span></span>
        <span className="sub sub-soon">Teachers Benevolent Fund<span className="soon-tag">Soon</span></span>
        <span className="sub sub-soon">ByLaws of OCA<span className="soon-tag">Soon</span></span>

        <a className="top" href="#/home!events" onClick={() => setMobileNavOpen(false)}>Events</a>
        <a className="sub" href="#/annual-dinner" onClick={() => setMobileNavOpen(false)}>Annual Dinner Get Together</a>
        <a className="sub" href="#/annual-lunch" onClick={() => setMobileNavOpen(false)}>Annual Lunch Get Together</a>
        <a className="sub" href="#/sports" onClick={() => setMobileNavOpen(false)}>OCA Sports</a>
        <span className="sub-head">Gallery</span>
        <span className="sub sub2 sub-soon">School Anthem<span className="soon-tag">Soon</span></span>
        <span className="sub sub2 sub-soon">History of the School<span className="soon-tag">Soon</span></span>
        <span className="sub sub2 sub-soon">School Principals<span className="soon-tag">Soon</span></span>
        <span className="sub sub2 sub-soon">School Magazine<span className="soon-tag">Soon</span></span>
        <span className="sub sub2 sub-soon">Photographs<span className="soon-tag">Soon</span></span>

        <span className="top">Directory</span>
        <span className="sub sub-soon">Find Your Batchmates<span className="soon-tag">Soon</span></span>
        <span className="sub sub-soon">Worldwide Chapters<span className="soon-tag">Soon</span></span>

        <span className="top">OCA Connect</span>
        <span className="sub sub-soon">News Makers<span className="soon-tag">Soon</span></span>
        <span className="sub sub-soon">Alumni Services<span className="soon-tag">Soon</span></span>
        <span className="sub sub-soon">Careers<span className="soon-tag">Soon</span></span>
        <span className="sub sub-soon">Networking<span className="soon-tag">Soon</span></span>
        <span className="sub sub-soon">OCA Internships Program<span className="soon-tag">Soon</span></span>
        <span className="sub sub-soon">Newsletters<span className="soon-tag">Soon</span></span>
        <span className="sub sub-soon">Remembrance<span className="soon-tag">Soon</span></span>

        <a className="top" href="#/membership" onClick={() => setMobileNavOpen(false)}>Membership</a>
        <a className="sub" href="#/membership" onClick={() => setMobileNavOpen(false)}>Become a Member</a>
        <a className="sub" href="#/member-signin" onClick={() => setMobileNavOpen(false)}>As an OCA Member</a>
        <span className="sub sub-soon">As a Partner Organization<span className="soon-tag">Soon</span></span>

        <div className="cta-row">
          <a className="btn btn-gold" href="#/donation" onClick={() => setMobileNavOpen(false)}>Contribute</a>
          <a className="btn btn-primary" href="#/membership" onClick={() => setMobileNavOpen(false)}>Become a Member</a>
          <a className="btn btn-ghost" href="#/member-signin" onClick={() => setMobileNavOpen(false)}>Sign in as OCA Member</a>
          <span className="btn btn-ghost" style={{ opacity: 0.6, cursor: 'default' }}>Sign in as Partner Organization (Soon)</span>
        </div>
      </div>
    </>
  );
};

export default Header;

