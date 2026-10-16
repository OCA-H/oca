'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { memberPortalContent } from '../content';
import { useMemberPortalHandler } from '../handler';
import { memberPortalHelper } from '../helper';

export const MemberPortalView: React.FC = () => {
  const { profile, isLoading, error, isSigningOut, handleSignOut } = useMemberPortalHandler();

  if (isLoading) {
    return (
      <section className="content-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              border: '3px solid rgba(212, 168, 67, 0.25)',
              borderTopColor: '#d4a843',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ color: 'var(--navy)', fontWeight: 500, fontSize: '15px' }}>
            Verifying Columban credentials...
          </p>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </section>
    );
  }

  if (error || !profile) {
    return (
      <section className="content-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px', padding: '32px' }}>
          <h2 style={{ color: '#c0392b', marginBottom: '12px' }}>Authentication Required</h2>
          <p style={{ color: '#555', marginBottom: '24px' }}>
            {error || 'Your member session could not be verified. Please sign in to access the member area.'}
          </p>
          <Link href={ROUTES.MEMBER_SIGNIN} className="btn btn-primary">
            Go to Member Sign In
          </Link>
        </div>
      </section>
    );
  }

  const initials = memberPortalHelper.getInitials(profile.fullName);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="crumb" aria-label="Breadcrumb">
        <div className="wrap">
          <Link href={memberPortalContent.breadcrumb.homeHref}>{memberPortalContent.breadcrumb.homeText}</Link>
          <span className="sep">/</span>
          <span>{memberPortalContent.breadcrumb.sectionText}</span>
          <span className="sep">/</span>
          <span>{memberPortalContent.breadcrumb.pageText}</span>
        </div>
      </nav>

      {/* Member Portal Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0d1627 0%, #172642 100%)',
          color: '#fff',
          padding: '48px 0 40px',
          borderBottom: '3px solid #d4a843',
        }}
      >
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #d4a843 0%, #aa8022 100%)',
                color: '#0f1a30',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                letterSpacing: '1px',
              }}
            >
              {initials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-block',
                    background: 'rgba(212, 168, 67, 0.2)',
                    color: '#d4a843',
                    border: '1px solid rgba(212, 168, 67, 0.4)',
                    padding: '2px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                  }}
                >
                  {profile.membershipType || 'Life Member'}
                </span>
                <span
                  style={{
                    display: 'inline-block',
                    background: 'rgba(46, 204, 113, 0.2)',
                    color: '#2ecc71',
                    border: '1px solid rgba(46, 204, 113, 0.4)',
                    padding: '2px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  ● {profile.status || 'Active'}
                </span>
              </div>
              <h1 style={{ fontSize: '28px', margin: '8px 0 4px', fontWeight: 700, color: '#fff' }}>
                Welcome back, {profile.fullName}
              </h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                Columban ID: <strong style={{ color: '#d4a843' }}>{profile.memberId}</strong>
                {profile.batchYear ? ` · Batch of ${profile.batchYear}` : ''}
                {profile.house ? ` · ${profile.house} House` : ''}
              </p>
            </div>
          </div>

          <div>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="btn btn-ghost"
              style={{
                borderColor: 'rgba(255,255,255,0.35)',
                color: '#fff',
                background: 'rgba(255,255,255,0.08)',
                padding: '10px 20px',
                fontSize: '13.5px',
                cursor: 'pointer',
              }}
            >
              {isSigningOut ? 'Signing out...' : 'Sign Out →'}
            </button>
          </div>
        </div>
      </section>

      {/* Main Portal Content */}
      <section className="content-section" style={{ background: '#f8f9fa', padding: '44px 0 64px' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>

            {/* Columban Digital Membership Card */}
            <div
              style={{
                background: 'linear-gradient(145deg, #101c33 0%, #1a2c4e 60%, #0d1627 100%)',
                color: '#fff',
                borderRadius: '16px',
                padding: '28px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(15, 26, 48, 0.18)',
                border: '1px solid rgba(212, 168, 67, 0.4)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '160px',
                  height: '160px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(212,168,67,0.2) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#d4a843', fontWeight: 600 }}>
                    Old Columbans Association
                  </span>
                  <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '2px', fontFamily: 'var(--serif)' }}>
                    Official Member Pass
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(212, 168, 67, 0.15)',
                    border: '1px solid #d4a843',
                    color: '#d4a843',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                  }}
                >
                  OCA VERIFIED
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '0.5px' }}>{profile.fullName}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                  {profile.email} · {profile.mobile || 'Registered Columban'}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '16px' }}>
                <div>
                  <span style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', display: 'block' }}>Member ID</span>
                  <strong style={{ fontSize: '13px', color: '#d4a843' }}>{profile.memberId}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', display: 'block' }}>Batch</span>
                  <strong style={{ fontSize: '13px' }}>{profile.batchYear || 'Alumnus'}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', display: 'block' }}>House</span>
                  <strong style={{ fontSize: '13px' }}>{profile.house || 'Columban'}</strong>
                </div>
              </div>

              <div style={{ marginTop: '20px', fontSize: '11px', color: 'rgba(255,255,255,0.45)', textAlign: 'right', fontStyle: 'italic' }}>
                Sub Hoc Signo Vinces
              </div>
            </div>

            {/* Quick Member Overview & Services */}
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                border: '1px solid #e2e8f0',
              }}
            >
              <h3 style={{ fontSize: '18px', margin: '0 0 16px', color: 'var(--navy)', fontWeight: 700 }}>
                Columban Membership Privileges
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: '#27ae60', fontSize: '16px', lineHeight: 1 }}>✔</span>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#1a2744' }}>Priority Annual Dinner Booking</strong>
                    <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#666' }}>
                      Early bird rates and reserved tables for Batch 1994 &amp; milestone anniversary batches.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: '#27ae60', fontSize: '16px', lineHeight: 1 }}>✔</span>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#1a2744' }}>Directory &amp; Global Chapters</strong>
                    <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#666' }}>
                      Access Columban networks in the UK, USA, Singapore, Australia, and Middle East.
                    </p>
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: '#27ae60', fontSize: '16px', lineHeight: 1 }}>✔</span>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#1a2744' }}>Teachers Benevolent Fund Participation</strong>
                    <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#666' }}>
                      Directly support healthcare and comfort for retired Columban masters and teachers.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

          </div>

          {/* Quick Access Tiles */}
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--navy)', marginBottom: '18px', fontWeight: 700 }}>
              Member Portals &amp; Event Passes
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {memberPortalContent.quickLinks.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '22px 20px',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = '#d4a843';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span
                        style={{
                          background: 'rgba(212, 168, 67, 0.12)',
                          color: '#aa8022',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <strong style={{ fontSize: '16px', color: 'var(--navy)', display: 'block', marginBottom: '6px' }}>
                      {item.title}
                    </strong>
                    <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: 1.4 }}>
                      {item.desc}
                    </p>
                  </div>
                  <div style={{ marginTop: '16px', fontSize: '13px', fontWeight: 600, color: '#d4a843' }}>
                    Access now →
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default MemberPortalView;
