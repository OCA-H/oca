import React from 'react';

export const CommitteeSection: React.FC = () => {
  return (
    <section className="section" id="committee" style={{ background: "#fff", borderTop: "1px solid var(--border)" }}>
      <div className="wrap">
        <div className="section-head stack" style={{ maxWidth: "none", textAlign: "center" }}>
          <span className="eyebrow">Governance</span>
          <h2>Executive Committee, 2023 – 25</h2>
        </div>
        <div className="committee-grid">
          <div className="committee-card">
            <div className="committee-photo duo-navy photo-tile">
              <img className="tile-img" src="https://www.oldcolumban.net/wp-content/uploads/2022/02/SVK-Profile-Pic-n.png" alt="Santosh V. Kalyani, President" loading="lazy" decoding="async" />
              <span className="initials">SVK</span>
            </div>
            <div className="committee-body"><h4>Santosh V. Kalyani</h4><div className="role">PRESIDENT</div></div>
          </div>
          <div className="committee-card">
            <div className="committee-photo duo-teal photo-tile">
              <img className="tile-img" src="https://www.oldcolumban.net/wp-content/uploads/2022/05/Anurag-agarawal-n-1.png" alt="Anurag Aggarwal, Secretary" loading="lazy" decoding="async" />
              <span className="initials">AA</span>
            </div>
            <div className="committee-body"><h4>Anurag Aggarwal</h4><div className="role">SECRETARY</div></div>
          </div>
          <div className="committee-card">
            <div className="committee-photo duo-gold photo-tile">
              <img className="tile-img" src="https://www.oldcolumban.net/wp-content/uploads/2020/02/Pranav-Uppal.jpg" alt="Kuwar Pranav Pratap Uppal, Treasurer" loading="lazy" decoding="async" />
              <span className="initials">KU</span>
            </div>
            <div className="committee-body"><h4>Kuwar Pranav Pratap Uppal</h4><div className="role">TREASURER</div></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommitteeSection;
