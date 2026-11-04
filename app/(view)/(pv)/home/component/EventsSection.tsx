import React from 'react';
import type { HomeEventsContent } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';
import { PhotoTile, type TileTone } from '@/app/(view)/common/component/PageParts';
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
                <PhotoTile
                  className="event-media"
                  src={event.image}
                  alt={event.imageAlt}
                  caption={event.caption}
                  tone={toneAt(i, 2) as TileTone}
                />
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
