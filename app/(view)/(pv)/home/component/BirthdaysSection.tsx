import React from 'react';

export const BirthdaysSection: React.FC = () => {
  return (
    <section className="section tint-gold" style={{ padding: "64px 0" }}>
      <div className="wrap">
        <div className="bday-section-head">
          <div className="bday-lead">
            <div className="icon-circle"><svg viewBox="0 0 24 24" fill="none"><path d="M12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0v4M4 10h16M4 10l1 10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2l1-10M4 10a2 2 0 1 0 4 0 2 2 0 1 0 4 0 2 2 0 1 0 4 0 2 2 0 1 0 4 0" stroke="var(--gold)" strokeWidth="1.5"/></svg></div>
            <div>
              <h3>Today's Birthdays</h3>
              <p>5 Columbans celebrating today</p>
            </div>
          </div>
          <a className="btn btn-ghost btn-sm" href="#">See all →</a>
        </div>
        <div className="bday-cards">
          <div className="bday-card">
            <div className="ring" style={{ background: "var(--navy)" }}>RK</div>
            <div className="bday-info">
              <div className="name">R. Kapoor</div>
            <div className="batch">Batch '88</div>
            <button className="bday-wish-btn"><svg viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" stroke="currentColor" strokeWidth="1.8"/></svg> Send Wishes</button>
            </div>
          </div>
          <div className="bday-card">
            <div className="ring" style={{ background: "var(--teal-dark)" }}>SM</div>
            <div className="bday-info">
              <div className="name">S. Mehta</div>
            <div className="batch">Batch '95</div>
            <button className="bday-wish-btn"><svg viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" stroke="currentColor" strokeWidth="1.8"/></svg> Send Wishes</button>
            </div>
          </div>
          <div className="bday-card">
            <div className="ring" style={{ background: "var(--gold-dark)" }}>AB</div>
            <div className="bday-info">
              <div className="name">A. Bose</div>
            <div className="batch">Batch '79</div>
            <button className="bday-wish-btn"><svg viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" stroke="currentColor" strokeWidth="1.8"/></svg> Send Wishes</button>
            </div>
          </div>
          <div className="bday-card">
            <div className="ring" style={{ background: "var(--navy)" }}>VT</div>
            <div className="bday-info">
              <div className="name">V. Trivedi</div>
            <div className="batch">Batch '02</div>
            <button className="bday-wish-btn"><svg viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" stroke="currentColor" strokeWidth="1.8"/></svg> Send Wishes</button>
            </div>
          </div>
          <div className="bday-card">
            <div className="ring" style={{ background: "var(--teal-dark)" }}>HK</div>
            <div className="bday-info">
              <div className="name">H. Khanna</div>
            <div className="batch">Batch '91</div>
            <button className="bday-wish-btn"><svg viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" stroke="currentColor" strokeWidth="1.8"/></svg> Send Wishes</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BirthdaysSection;
