import React from 'react';

export const GallerySection: React.FC = () => {
  return (
    <section className="section tint-gold" id="gallery">
      <div className="wrap">
        <div className="section-head">
          <div className="copy">
            <span className="eyebrow">Our Gallery</span>
            <h2>Moments from the OCA community</h2>
            <p>Browse by album — the story keeps playing, or jump straight to the one you want.</p>
          </div>
          <a className="btn btn-ghost btn-sm" href="https://www.oldcolumban.net/events-photographs/">View all photographs →</a>
        </div>
    
        <div className="media-viewer">
          <div className="media-stage">
            <div className="photo-tile duo-navy" id="stageTile">
              <img />
              <div className="tile-icon" id="stageIcon"><svg viewBox="0 0 24 24" fill="none"><path d="M4 21h16M6 21V9l6-4 6 4v12M10 21v-5h4v5" stroke="#fff" strokeWidth="1.4"/></svg></div>
              <div className="stage-counter" id="stageCounter">1 / 5</div>
              <div className="tile-caption"><div className="t" id="stageCaption">Head table toast</div><div className="s" id="stageSub">Annual Lunch 2025 · Nov 2025</div></div>
            </div>
          </div>
    
          <div className="album-tabs" id="albumTabs">
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
