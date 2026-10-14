'use client';

import React, { useState } from 'react';
import { ROUTES } from '@/app/views/common/helper/route';

interface HeaderProps {
  activeRoute?: string;
}

const NAV_MAP: Record<string, string> = {
  'vision-mission': 'about',
  'executive-committee': 'about',
  'membership': 'membership',
  'donation': 'membership',
  'annual-lunch': 'events',
  'annual-dinner': 'events',
  'sports': 'events',
};

export const Header: React.FC<HeaderProps> = ({ activeRoute }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const activeNav = activeRoute ? NAV_MAP[activeRoute] : undefined;

  return (
    <>
      <header>
        <div className="wrap topbar">
          <a href={ROUTES.TOP} className="brand">
            <img
              className="header-logo-img"
              src="/images/oca-header-logo.jpg"
              alt="Old Columbans Association"
            />
          </a>

          <nav className="primary-nav" aria-label="Primary">
            <div className="nav-item">
              <span className={`nav-link ${activeNav === 'about' ? 'active' : ''}`} data-nav="about">About OCA <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" /></svg></span>
              <div className="dropdown">
                <a href={ROUTES.VISION_MISSION}>Our Mission &amp; Objectives</a>
                <a href={ROUTES.EXECUTIVE_COMMITTEE}>Executive Committee</a>
                <div className="dropdown-soon"><span>Batch Coordinators</span><span className="soon-tag">Coming soon</span></div>
                <div className="dropdown-soon"><span>OCA Social Conscience</span><span className="soon-tag">Coming soon</span></div>
                <div className="dropdown-soon"><span>Teachers Benevolent Fund</span><span className="soon-tag">Coming soon</span></div>
                <div className="dropdown-soon"><span>ByLaws of OCA</span><span className="soon-tag">Coming soon</span></div>
              </div>
            </div>
            <div className="nav-item">
              <span className={`nav-link ${activeNav === 'events' ? 'active' : ''}`} data-nav="events">Events <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" /></svg></span>
              <div className="dropdown">
                <a href={ROUTES.ANNUAL_DINNER}>OCA – Annual Dinner Get Together</a>
                <a href={ROUTES.ANNUAL_LUNCH}>OCA – Annual Lunch Get Together</a>
                <a href={ROUTES.SPORTS}>OCA Sports</a>
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
              <span className="nav-link" data-nav="directory">Directory <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" /></svg></span>
              <div className="dropdown">
                <div className="dropdown-soon"><span>Find Your Batchmates</span><span className="soon-tag">Coming soon</span></div>
                <div className="dropdown-soon"><span>Worldwide Chapters</span><span className="soon-tag">Coming soon</span></div>
              </div>
            </div>
            <div className="nav-item">
              <span className="nav-link" data-nav="connect">OCA Connect <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" /></svg></span>
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
            {/* <div className="nav-item">
              <span className="nav-link" data-nav="membership">Membership <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6"/></svg></span>
              <div className="dropdown">
                <a href={ROUTES.MEMBERSHIP}>Become a Member</a>
                <a href={ROUTES.MEMBER_SIGNIN}>As an OCA Member</a>
                <a href={ROUTES.PARTNER_ORGANIZATION}>As a Partner Organization</a>
              </div>
            </div> */}
          </nav>

          <div className="header-actions">
            <a className="btn btn-gold btn-sm" href={ROUTES.DONATION}>Contribute</a>
            <a className="btn btn-primary btn-sm" href={ROUTES.MEMBERSHIP}>Become a Member</a>
            <div className="nav-item signin-item">
              <button className="icon-btn" type="button">Sign In <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" /></svg></button>
              <div className="dropdown dropdown-right">
                <a href={ROUTES.MEMBER_SIGNIN}>As an OCA Member</a>
                <a href={ROUTES.PARTNER_ORGANIZATION}>As a Partner Organization</a>
              </div>
            </div>
            <button className="burger" aria-label="Open menu" onClick={() => setMobileNavOpen(true)}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
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
        <a className="top" href={ROUTES.VISION_MISSION} onClick={() => setMobileNavOpen(false)}>About OCA</a>
        <a className="sub" href={ROUTES.VISION_MISSION} onClick={() => setMobileNavOpen(false)}>Our Mission &amp; Objectives</a>
        <a className="sub" href={ROUTES.EXECUTIVE_COMMITTEE} onClick={() => setMobileNavOpen(false)}>Executive Committee</a>
        <span className="sub sub-soon">Batch Coordinators<span className="soon-tag">Soon</span></span>
        <span className="sub sub-soon">OCA Social Conscience<span className="soon-tag">Soon</span></span>
        <span className="sub sub-soon">Teachers Benevolent Fund<span className="soon-tag">Soon</span></span>
        <span className="sub sub-soon">ByLaws of OCA<span className="soon-tag">Soon</span></span>

        <a className="top" href={ROUTES.HOME_EVENTS} onClick={() => setMobileNavOpen(false)}>Events</a>
        <a className="sub" href={ROUTES.ANNUAL_DINNER} onClick={() => setMobileNavOpen(false)}>Annual Dinner Get Together</a>
        <a className="sub" href={ROUTES.ANNUAL_LUNCH} onClick={() => setMobileNavOpen(false)}>Annual Lunch Get Together</a>
        <a className="sub" href={ROUTES.SPORTS} onClick={() => setMobileNavOpen(false)}>OCA Sports</a>
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

        <a className="top" href={ROUTES.MEMBERSHIP} onClick={() => setMobileNavOpen(false)}>Membership</a>
        <a className="sub" href={ROUTES.MEMBERSHIP} onClick={() => setMobileNavOpen(false)}>Become a Member</a>
        <a className="sub" href={ROUTES.MEMBER_SIGNIN} onClick={() => setMobileNavOpen(false)}>As an OCA Member</a>
        <a className="sub" href={ROUTES.PARTNER_ORGANIZATION} onClick={() => setMobileNavOpen(false)}>As a Partner Organization</a>

        <div className="cta-row">
          <a className="btn btn-gold" href={ROUTES.DONATION} onClick={() => setMobileNavOpen(false)}>Contribute</a>
          <a className="btn btn-primary" href={ROUTES.MEMBERSHIP} onClick={() => setMobileNavOpen(false)}>Become a Member</a>
          <a className="btn btn-ghost" href={ROUTES.MEMBER_SIGNIN} onClick={() => setMobileNavOpen(false)}>Sign in as OCA Member</a>
          <a className="btn btn-ghost" href={ROUTES.PARTNER_ORGANIZATION} onClick={() => setMobileNavOpen(false)}>Sign in as Partner Organization</a>
        </div>
      </div>
    </>
  );
};

export default Header;
