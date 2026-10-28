import React from 'react';
import type { HomeEventsContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { SiteLink, toneAt } from './SiteLink';

const CALENDAR_ICON = 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z';
const EVENT_ICON = 'M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2M12 3l2 4-2 1-2-1 2-4Z';

export const EventsSection: React.FC<{ content: HomeEventsContent }> = ({ content }) => {
  return (
    <section className="section" id="events">
      <div className="wrap">
        <div className="section-head stack">
          {content.eyebrow && <span className="eyebrow">{content.eyebrow}</span>}
          <h2>{content.title}</h2>
          {content.intro && <p>{content.intro}</p>}
        </div>
        <div className="event-row">
          {content.items.map((event, i) => {
            // The first event is the featured one: larger, with the whole card linking through.
            const featured = i === 0;
            return (
              <div className={`event-card${featured ? ' event-featured' : ''}`} key={`${i}-${event.title}`}>
                <div className={`event-media photo-tile ${toneAt(i, 2)}`}>
                  <img className="tile-img" src={event.image} alt={event.imageAlt} loading="lazy" decoding="async" data-ph="photo" />
                  {event.dateChip && <div className="event-date-chip">{event.dateChip}</div>}
                  <div className="tile-icon">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d={featured ? CALENDAR_ICON : EVENT_ICON} stroke="#fff" strokeWidth="1.4" />
                    </svg>
                  </div>
                  {event.caption && (
                    <div className="tile-caption">
                      <div className="t">{event.caption}</div>
                    </div>
                  )}
                </div>
                <div className="event-body">
                  {event.date && <div className="date">{event.date}</div>}
                  <h4>{event.title}</h4>
                  {event.desc && <p>{event.desc}</p>}
                  {event.ctaHref && (
                    <SiteLink className={`btn ${featured ? 'btn-primary event-cta' : 'btn-secondary'} btn-sm`} href={event.ctaHref}>
                      {event.ctaLabel || 'View Details →'}
                    </SiteLink>
                  )}
                </div>
                {featured && event.ctaHref && <SiteLink className="event-overlay" href={event.ctaHref} tabIndex={-1} aria-hidden="true"></SiteLink>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
