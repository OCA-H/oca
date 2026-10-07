import React from 'react';

export const ContactSection: React.FC = () => {
  return (
    <section className="section tint-teal" id="contact">
      <div className="wrap">
        <div className="contact-layout">
          <div className="contact-info-col">
            <div className="contact-intro">
              <span className="eyebrow">Get in touch</span>
              <h2>We'd love to hear from you</h2>
              <p>Questions about membership, an event, or just want to say hello — write to the Secretariat and we'll get back to you.</p>
            </div>
            <div className="contact-row"><svg viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L8.09 9.63a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92Z" stroke="currentColor" strokeWidth="1.6"/></svg><div><div className="label">Call</div>011-23748666</div></div>
            <div className="contact-row"><svg viewBox="0 0 24 24" fill="none"><path d="M4 4h16v16H4V4Zm0 0 8 9 8-9" stroke="currentColor" strokeWidth="1.6"/></svg><div><div className="label">Email</div>info@oldcolumban.net</div></div>
            <div className="contact-row"><svg viewBox="0 0 24 24" fill="none"><path d="M12 22s8-7.4 8-13a8 8 0 1 0-16 0c0 5.6 8 13 8 13ZM12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.6"/></svg><div><div className="label">Address</div>St. Columba's School, Ashoka Place, New Delhi – 110 001</div></div>
            <div className="contact-cta">
              <h4>Ready to reconnect?</h4>
              <p>Become a lifetime member and stay part of the Columban family for good.</p>
              <a className="btn btn-primary btn-sm" href="#/membership">Get Lifetime Membership</a>
            </div>
          </div>
          <form className="contact-form-panel" onSubmit={(e) => e.preventDefault()}>
            <div className="field-row">
              <div className="field"><label>Full Name *</label><input type="text" required placeholder="Your name" /></div>
              <div className="field"><label>Batch / Year</label><input type="text" placeholder="e.g. 1995" /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>Email *</label><input type="email" required placeholder="you@example.com" /></div>
              <div className="field"><label>Phone</label><input type="tel" placeholder="+91" /></div>
            </div>
            <div className="field"><label>Subject</label><input type="text" placeholder="What is this about?" /></div>
            <div className="field"><label>Message *</label><textarea required placeholder="Write your message here…"></textarea></div>
            <button className="btn btn-primary" type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
