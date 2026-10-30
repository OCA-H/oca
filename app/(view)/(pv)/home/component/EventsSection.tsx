import React from 'react';
import type { HomeEventsContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { SiteLink, toneAt } from './SiteLink';

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
