import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer>
      <div className="wrap footer-top">
        <div className="footer-brand">
          <a href="#top" className="brand" style={{ alignItems: "center" }}>
            <img
              className="footer-logo-img"
              src="/images/oca-crest.png"
              alt="Old Columbans Association crest"
              loading="lazy"
              decoding="async"
            />
            <span className="brand-text"><span className="name">Old Columbans Association</span></span>
          </a>
          <p>OCA's mission is to praise, promote and protect St. Columba's School and its students, and to unite, inform and involve alumni and friends in fellowship and support of each other and the school.</p>
          <div className="social-row" style={{ marginTop: "18px" }}>
            <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none"><path d="M15 8.5h2.5V5.2c-.43-.06-1.9-.2-3.62-.2-3.58 0-6.03 2.24-6.03 6.36v3.17H4.5v3.7h3.35V23h3.8v-4.77h3.22l.5-3.7h-3.72v-2.76c0-1.07.29-1.8 1.85-1.8Z" fill="currentColor" /></svg></a>
            <a href="#" aria-label="X (Twitter)"><svg viewBox="0 0 24 24" fill="none"><path d="M18.9 3H21.6L15.6 10 22.7 21H17.1L12.7 14.4 7.6 21H4.9L11.3 13.5 4.5 3H10.2L14.2 9.1 18.9 3Zm-1 16.3H19.4L7.2 4.6H5.6L17.9 19.3Z" fill="currentColor" /></svg></a>
            <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" /><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" /></svg></a>
            <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none"><rect x="2.5" y="6" width="19" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.6" /><path d="M10.5 9.5v5l4.5-2.5-4.5-2.5Z" fill="currentColor" /></svg></a>
            <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2.5" stroke="currentColor" strokeWidth="1.6" /><path d="M7.8 10v7M7.8 7.2v.1M12 17v-4.2c0-1.5.9-2.5 2.2-2.5 1.2 0 2 .9 2 2.4V17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></a>
          </div>
        </div>
        <div className="footer-col">
          <h5>Contact Info</h5>
          <a href="#"><svg viewBox="0 0 24 24" fill="none"><path d="M12 22s8-7.4 8-13a8 8 0 1 0-16 0c0 5.6 8 13 8 13ZM12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.6" /></svg><span>St. Columba's School, Ashoka Place, New Delhi – 110 001</span></a>
          <a href="tel:01123748666"><svg viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L8.09 9.63a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92Z" stroke="currentColor" strokeWidth="1.6" /></svg><span>011-23748666</span></a>
          <a href="mailto:info@oldcolumban.net"><svg viewBox="0 0 24 24" fill="none"><path d="M4 4h16v16H4V4Zm0 0 8 9 8-9" stroke="currentColor" strokeWidth="1.6" /></svg><span>info@oldcolumban.net</span></a>
        </div>
        <div className="footer-col">
          <h5>Quick Links</h5>
          <a href="#top">Home</a>
          <a href="https://www.oldcolumban.net/members-2/">Login</a>
          <a href="#/membership">New Membership</a>
          <a href="#/donation">Contribute</a>
        </div>
      </div>
      <div className="wrap footer-bottom"><span>Copyright 2025 Old Columbans Association, All Rights Reserved</span></div>
    </footer>
  );
};

export default Footer;
