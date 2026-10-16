'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { useAuth } from '@/app/(view)/common/helper/useAuth';

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
  'member-signin': 'membership',
  'partner-organization': 'membership',
};

export const Header: React.FC<HeaderProps> = ({ activeRoute }) => {
  const router = useRouter();
  const { isAuthenticated, user, signOut } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const activeNav = activeRoute ? NAV_MAP[activeRoute] : undefined;

  const handleLinkClick = (_href?: string) => {
    setMobileNavOpen(false);
  };

  return (
    <>
      <header>
        <div className="wrap topbar">
          <Link
            href={ROUTES.HOME}
            className="brand"
            onClick={() => setMobileNavOpen(false)}
          >
            <img
              className="header-logo-img"
              src="/images/oca-header-logo.jpg"
              alt="Old Columbans Association"
            />
          </Link>

          <nav className="primary-nav" aria-label="Primary">
            <div className="nav-item">
              <span className={`nav-link ${activeNav === 'about' ? 'active' : ''}`} data-nav="about">About OCA <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" /></svg></span>
              <div className="dropdown">
                <Link href={ROUTES.VISION_MISSION} onClick={() => handleLinkClick(ROUTES.VISION_MISSION)}>Our Mission &amp; Objectives</Link>
                <Link href={ROUTES.EXECUTIVE_COMMITTEE} onClick={() => handleLinkClick(ROUTES.EXECUTIVE_COMMITTEE)}>Executive Committee</Link>
                <div className="dropdown-soon"><span>Batch Coordinators</span><span className="soon-tag">Coming soon</span></div>
                <div className="dropdown-soon"><span>OCA Social Conscience</span><span className="soon-tag">Coming soon</span></div>
                <div className="dropdown-soon"><span>Teachers Benevolent Fund</span><span className="soon-tag">Coming soon</span></div>
                <div className="dropdown-soon"><span>ByLaws of OCA</span><span className="soon-tag">Coming soon</span></div>
              </div>
            </div>
            <div className="nav-item">
              <span className={`nav-link ${activeNav === 'events' ? 'active' : ''}`} data-nav="events">Events <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" /></svg></span>
              <div className="dropdown">
                <Link href={ROUTES.ANNUAL_DINNER} onClick={() => handleLinkClick(ROUTES.ANNUAL_DINNER)}>OCA – Annual Dinner Get Together</Link>
                <Link href={ROUTES.ANNUAL_LUNCH} onClick={() => handleLinkClick(ROUTES.ANNUAL_LUNCH)}>OCA – Annual Lunch Get Together</Link>
                <Link href={ROUTES.SPORTS} onClick={() => handleLinkClick(ROUTES.SPORTS)}>OCA Sports</Link>
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
                <Link href={ROUTES.MEMBERSHIP} onClick={() => handleLinkClick(ROUTES.MEMBERSHIP)}>Become a Member</Link>
                <Link href={ROUTES.MEMBER_SIGNIN} onClick={() => handleLinkClick(ROUTES.MEMBER_SIGNIN)}>As an OCA Member</Link>
                <Link href={ROUTES.PARTNER_ORGANIZATION} onClick={() => handleLinkClick(ROUTES.PARTNER_ORGANIZATION)}>As a Partner Organization</Link>
              </div>
            </div> */}
          </nav>

          <div className="header-actions">
            <Link className="btn btn-gold btn-sm" href={ROUTES.DONATION} onClick={() => handleLinkClick(ROUTES.DONATION)}>Contribute</Link>
            <Link className="btn btn-primary btn-sm" href={ROUTES.MEMBERSHIP} onClick={() => handleLinkClick(ROUTES.MEMBERSHIP)}>Become a Member</Link>
            {isAuthenticated ? (
              <div className="nav-item signin-item member-profile-item">
                <button
                  type="button"
                  className="icon-btn member-profile-btn"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderColor: 'var(--gold, #d4a843)',
                    color: 'var(--navy)',
                    padding: '6px 12px',
                    background: 'rgba(212, 168, 67, 0.08)',
                    borderRadius: 'var(--radius-s, 6px)',
                  }}
                >
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: 'var(--gold, #d4a843)',
                      color: '#fff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {(user?.fullName || 'M').charAt(0).toUpperCase()}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '13.5px' }}>
                    {user?.fullName?.split(' ')[0] || 'Member'}
                  </span>
                  <svg viewBox="0 0 12 8" fill="none" style={{ width: '9px', height: '9px', opacity: 0.8 }}>
                    <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
                <div className="dropdown dropdown-right" style={{ minWidth: '220px', padding: '8px 0' }}>
                  <div
                    style={{
                      padding: '10px 16px',
                      borderBottom: '1px solid var(--border, #eee)',
                      marginBottom: '6px',
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '14px' }}>
                      {user?.fullName || 'Columban Member'}
                    </div>
                    {user?.memberId && (
                      <div style={{ fontSize: '11.5px', color: '#666', marginTop: '2px' }}>
                        ID: {user.memberId}
                      </div>
                    )}
                    {user?.membershipType && (
                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: '6px',
                          background: 'rgba(212, 168, 67, 0.15)',
                          color: '#8a6514',
                          fontSize: '10.5px',
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        {user.membershipType}
                      </span>
                    )}
                  </div>
                  <Link
                    href={ROUTES.PAGE_MEMBER_PORTAL}
                    style={{ fontWeight: 600, color: 'var(--gold, #d4a843)', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => handleLinkClick(ROUTES.PAGE_MEMBER_PORTAL)}
                  >
                    ★ Member Portal
                  </Link>
                  <button
                    type="button"
                    onClick={() => { signOut(); }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      padding: '10px 16px',
                      color: '#c0392b',
                      fontSize: '13.5px',
                      cursor: 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="nav-item signin-item">
                <button
                  className="icon-btn"
                  type="button"
                  aria-haspopup="true"
                  aria-label="Sign In options"
                >
                  Sign In <svg viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" /></svg>
                </button>
                <div className="dropdown dropdown-right">
                  <Link href={ROUTES.MEMBER_SIGNIN} onClick={() => handleLinkClick(ROUTES.MEMBER_SIGNIN)}>As an OCA Member</Link>
                  <Link href={ROUTES.PARTNER_ORGANIZATION} onClick={() => handleLinkClick(ROUTES.PARTNER_ORGANIZATION)}>As a Partner Organization</Link>
                </div>
              </div>
            )}
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
        <Link className="top" href={ROUTES.VISION_MISSION} onClick={() => handleLinkClick(ROUTES.VISION_MISSION)}>About OCA</Link>
        <Link className="sub" href={ROUTES.VISION_MISSION} onClick={() => handleLinkClick(ROUTES.VISION_MISSION)}>Our Mission &amp; Objectives</Link>
        <Link className="sub" href={ROUTES.EXECUTIVE_COMMITTEE} onClick={() => handleLinkClick(ROUTES.EXECUTIVE_COMMITTEE)}>Executive Committee</Link>
        <span className="sub sub-soon">Batch Coordinators<span className="soon-tag">Soon</span></span>
        <span className="sub sub-soon">OCA Social Conscience<span className="soon-tag">Soon</span></span>
        <span className="sub sub-soon">Teachers Benevolent Fund<span className="soon-tag">Soon</span></span>
        <span className="sub sub-soon">ByLaws of OCA<span className="soon-tag">Soon</span></span>

        <Link className="top" href={ROUTES.HOME_EVENTS} onClick={() => handleLinkClick(ROUTES.HOME_EVENTS)}>Events</Link>
        <Link className="sub" href={ROUTES.ANNUAL_DINNER} onClick={() => handleLinkClick(ROUTES.ANNUAL_DINNER)}>Annual Dinner Get Together</Link>
        <Link className="sub" href={ROUTES.ANNUAL_LUNCH} onClick={() => handleLinkClick(ROUTES.ANNUAL_LUNCH)}>Annual Lunch Get Together</Link>
        <Link className="sub" href={ROUTES.SPORTS} onClick={() => handleLinkClick(ROUTES.SPORTS)}>OCA Sports</Link>
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

        <Link className="top" href={ROUTES.MEMBERSHIP} onClick={() => handleLinkClick(ROUTES.MEMBERSHIP)}>Membership</Link>
        {isAuthenticated ? (
          <Link className="sub" href={ROUTES.PAGE_MEMBER_PORTAL} onClick={() => handleLinkClick(ROUTES.PAGE_MEMBER_PORTAL)} style={{ color: 'var(--gold, #d4a843)', fontWeight: 600 }}>★ Member Portal</Link>
        ) : null}
        <Link className="sub" href={ROUTES.MEMBERSHIP} onClick={() => handleLinkClick(ROUTES.MEMBERSHIP)}>Become a Member</Link>
        {!isAuthenticated && (
          <>
            <Link className="sub" href={ROUTES.MEMBER_SIGNIN} onClick={() => handleLinkClick(ROUTES.MEMBER_SIGNIN)}>As an OCA Member</Link>
            <Link className="sub" href={ROUTES.PARTNER_ORGANIZATION} onClick={() => handleLinkClick(ROUTES.PARTNER_ORGANIZATION)}>As a Partner Organization</Link>
          </>
        )}

        <div className="cta-row">
          <Link className="btn btn-gold" href={ROUTES.DONATION} onClick={() => handleLinkClick(ROUTES.DONATION)}>Contribute</Link>
          <Link className="btn btn-primary" href={ROUTES.MEMBERSHIP} onClick={() => handleLinkClick(ROUTES.MEMBERSHIP)}>Become a Member</Link>
          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '4px' }}>
              <div
                style={{
                  padding: '8px 12px',
                  background: 'rgba(212, 168, 67, 0.1)',
                  borderRadius: '6px',
                  border: '1px solid rgba(212, 168, 67, 0.3)',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--navy)' }}>
                  👤 {user?.fullName || 'Member'}
                </div>
                {user?.memberId && (
                  <div style={{ fontSize: '11px', color: '#666' }}>ID: {user.memberId}</div>
                )}
              </div>
              <Link className="btn btn-gold" href={ROUTES.PAGE_MEMBER_PORTAL} onClick={() => handleLinkClick(ROUTES.PAGE_MEMBER_PORTAL)}>★ Member Portal</Link>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  signOut();
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link className="btn btn-ghost" href={ROUTES.MEMBER_SIGNIN} onClick={() => handleLinkClick(ROUTES.MEMBER_SIGNIN)}>Sign in as OCA Member</Link>
              <Link className="btn btn-ghost" href={ROUTES.PARTNER_ORGANIZATION} onClick={() => handleLinkClick(ROUTES.PARTNER_ORGANIZATION)}>Sign in as Partner Organization</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
