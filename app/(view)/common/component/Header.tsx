'use client';

import React, { useEffect, useState } from 'react';
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

const Chevron = () => (
  <svg viewBox="0 0 12 8" fill="none" aria-hidden="true"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" /></svg>
);

interface MobileGroupProps {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

// One collapsible section of the mobile drawer.
const MobileGroup: React.FC<MobileGroupProps> = ({ label, open, onToggle, children }) => (
  <div className={`mnav-group${open ? ' is-open' : ''}`}>
    <button type="button" className="top" aria-expanded={open} onClick={onToggle}>
      {label}
      <Chevron />
    </button>
    <div className="mnav-items">
      <div>{children}</div>
    </div>
  </div>
);

export const Header: React.FC<HeaderProps> = ({ activeRoute }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading, user, signOut } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const activeNav = activeRoute ? NAV_MAP[activeRoute] : undefined;
  const [openGroup, setOpenGroup] = useState<string | null>(activeNav ?? null);
  // Only shows the link; /sv/admin and its APIs check the role themselves.
  const isAdmin = user?.role === 'admin';

  const handleLinkClick = (_href?: string) => {
    setMobileNavOpen(false);
  };

  const toggleGroup = (key: string) => setOpenGroup((current) => (current === key ? null : key));

  // While the drawer is open, the page behind it stays put and Escape closes it.
  useEffect(() => {
    if (!mobileNavOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileNavOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [mobileNavOpen]);

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
            {!isAuthLoading && !isAuthenticated && (
              <Link className="btn btn-primary btn-sm hdr-auth-in" href={ROUTES.MEMBERSHIP} onClick={() => handleLinkClick(ROUTES.MEMBERSHIP)}>Become a Member</Link>
            )}
            {/* Until the first check answers, hold the space instead of guessing "signed out". */}
            {isAuthLoading ? (
              <span className="mp-skel hdr-auth-skel" aria-hidden="true" />
            ) : isAuthenticated ? (
              <div className="nav-item signin-item member-profile-item">
                <button type="button" className="icon-btn member-profile-btn" aria-haspopup="true">
                  <span className="member-avatar">
                    {(user?.fullName || 'M').charAt(0).toUpperCase()}
                  </span>
                  <span className="member-name">
                    {user?.fullName?.split(' ')[0] || 'Member'}
                  </span>
                  <svg viewBox="0 0 12 8" fill="none">
                    <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
                <div className="dropdown dropdown-right member-dropdown">
                  <div className="member-card">
                    <span className="member-avatar member-avatar-lg">
                      {(user?.fullName || 'M').charAt(0).toUpperCase()}
                    </span>
                    <div className="member-card-body">
                      <div className="member-card-name">{user?.fullName || 'Columban Member'}</div>
                      {user?.memberId && <div className="member-card-id">ID: {user.memberId}</div>}
                      {user?.membershipType && <span className="member-card-badge">{user.membershipType}</span>}
                    </div>
                  </div>
                  <Link href={ROUTES.PROFILE} onClick={() => handleLinkClick(ROUTES.PROFILE)}>My Profile</Link>
                  {isAdmin && <Link href={ROUTES.ADMIN} onClick={() => handleLinkClick(ROUTES.ADMIN)}>Admin Panel</Link>}
                  <button type="button" className="member-signout" onClick={() => { signOut(); }}>
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
                  <div className="dropdown-soon"><span>As a Partner Organization</span><span className="soon-tag">Coming soon</span></div>
                </div>
              </div>
            )}
            <button className="burger" aria-label="Open menu" aria-expanded={mobileNavOpen} aria-controls="mobileNav" onClick={() => setMobileNavOpen(true)}>
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
      <div
        className={`mobile-nav ${mobileNavOpen ? 'open' : ''}`}
        id="mobileNav"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!mobileNavOpen}
      >
        <div className="mobile-nav-head">
          <Link href={ROUTES.HOME} onClick={() => handleLinkClick(ROUTES.HOME)}>
            <img className="mobile-nav-logo" src="/images/oca-header-logo.jpg" alt="Old Columbans Association" />
          </Link>
          <button type="button" className="mobile-nav-close" onClick={() => setMobileNavOpen(false)} aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>

        <nav className="mobile-nav-body" aria-label="Mobile">
          <MobileGroup label="About OCA" open={openGroup === 'about'} onToggle={() => toggleGroup('about')}>
            <Link className="sub" href={ROUTES.VISION_MISSION} onClick={() => handleLinkClick(ROUTES.VISION_MISSION)}>Our Mission &amp; Objectives</Link>
            <Link className="sub" href={ROUTES.EXECUTIVE_COMMITTEE} onClick={() => handleLinkClick(ROUTES.EXECUTIVE_COMMITTEE)}>Executive Committee</Link>
            <span className="sub sub-soon">Batch Coordinators<span className="soon-tag">Soon</span></span>
            <span className="sub sub-soon">OCA Social Conscience<span className="soon-tag">Soon</span></span>
            <span className="sub sub-soon">Teachers Benevolent Fund<span className="soon-tag">Soon</span></span>
            <span className="sub sub-soon">ByLaws of OCA<span className="soon-tag">Soon</span></span>
          </MobileGroup>

          <MobileGroup label="Events" open={openGroup === 'events'} onToggle={() => toggleGroup('events')}>
            <Link className="sub" href={ROUTES.ANNUAL_DINNER} onClick={() => handleLinkClick(ROUTES.ANNUAL_DINNER)}>Annual Dinner Get Together</Link>
            <Link className="sub" href={ROUTES.ANNUAL_LUNCH} onClick={() => handleLinkClick(ROUTES.ANNUAL_LUNCH)}>Annual Lunch Get Together</Link>
            <Link className="sub" href={ROUTES.SPORTS} onClick={() => handleLinkClick(ROUTES.SPORTS)}>OCA Sports</Link>
            <span className="sub-head">Gallery</span>
            <span className="sub sub2 sub-soon">School Anthem<span className="soon-tag">Soon</span></span>
            <span className="sub sub2 sub-soon">History of the School<span className="soon-tag">Soon</span></span>
            <span className="sub sub2 sub-soon">School Principals<span className="soon-tag">Soon</span></span>
            <span className="sub sub2 sub-soon">School Magazine<span className="soon-tag">Soon</span></span>
            <span className="sub sub2 sub-soon">Photographs<span className="soon-tag">Soon</span></span>
          </MobileGroup>

          <MobileGroup label="Directory" open={openGroup === 'directory'} onToggle={() => toggleGroup('directory')}>
            <span className="sub sub-soon">Find Your Batchmates<span className="soon-tag">Soon</span></span>
            <span className="sub sub-soon">Worldwide Chapters<span className="soon-tag">Soon</span></span>
          </MobileGroup>

          <MobileGroup label="OCA Connect" open={openGroup === 'connect'} onToggle={() => toggleGroup('connect')}>
            <span className="sub sub-soon">News Makers<span className="soon-tag">Soon</span></span>
            <span className="sub sub-soon">Alumni Services<span className="soon-tag">Soon</span></span>
            <span className="sub sub-soon">Careers<span className="soon-tag">Soon</span></span>
            <span className="sub sub-soon">Networking<span className="soon-tag">Soon</span></span>
            <span className="sub sub-soon">OCA Internships Program<span className="soon-tag">Soon</span></span>
            <span className="sub sub-soon">Newsletters<span className="soon-tag">Soon</span></span>
            <span className="sub sub-soon">Remembrance<span className="soon-tag">Soon</span></span>
          </MobileGroup>

          {isAuthenticated ? (
            <Link className="top" href={ROUTES.MEMBERSHIP} onClick={() => handleLinkClick(ROUTES.MEMBERSHIP)}>Membership</Link>
          ) : (
            <MobileGroup label="Membership" open={openGroup === 'membership'} onToggle={() => toggleGroup('membership')}>
              <Link className="sub" href={ROUTES.MEMBERSHIP} onClick={() => handleLinkClick(ROUTES.MEMBERSHIP)}>Become a Member</Link>
              <Link className="sub" href={ROUTES.MEMBER_SIGNIN} onClick={() => handleLinkClick(ROUTES.MEMBER_SIGNIN)}>As an OCA Member</Link>
              <span className="sub sub-soon">As a Partner Organization<span className="soon-tag">Soon</span></span>
            </MobileGroup>
          )}
        </nav>

        <div className="cta-row">
          {isAuthenticated && (
            <div className="member-card mobile-member-card">
              <span className="member-avatar member-avatar-lg">
                {(user?.fullName || 'M').charAt(0).toUpperCase()}
              </span>
              <div className="member-card-body">
                <div className="member-card-name">{user?.fullName || 'Member'}</div>
                {user?.memberId && <div className="member-card-id">ID: {user.memberId}</div>}
              </div>
            </div>
          )}
          <Link className="btn btn-gold" href={ROUTES.DONATION} onClick={() => handleLinkClick(ROUTES.DONATION)}>Contribute</Link>
          {isAuthenticated ? (
            <>
              <Link className="btn btn-primary" href={ROUTES.PROFILE} onClick={() => handleLinkClick(ROUTES.PROFILE)}>My Profile</Link>
              {isAdmin && (
                <Link className="btn btn-ghost" href={ROUTES.ADMIN} onClick={() => handleLinkClick(ROUTES.ADMIN)}>Admin Panel</Link>
              )}
              <button
                className="btn btn-ghost mobile-signout"
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  signOut();
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-primary" href={ROUTES.MEMBERSHIP} onClick={() => handleLinkClick(ROUTES.MEMBERSHIP)}>Become a Member</Link>
              <Link className="btn btn-ghost" href={ROUTES.MEMBER_SIGNIN} onClick={() => handleLinkClick(ROUTES.MEMBER_SIGNIN)}>Sign in as OCA Member</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
