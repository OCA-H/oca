import React from 'react';
import Link from 'next/link';
import { CtaBand, MottoFigure, PageCrumb, PageHero, SectionHead } from '@/app/(view)/common/component/PageParts';
import type { AnthemContent, SchoolHistoryContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { schoolAnthemContent as text } from '../content';
import { schoolAnthemHelper } from '../helper';
import { AnthemPlayer } from './subcomponents';

type Motto = Pick<SchoolHistoryContent, 'mottoLatin1' | 'mottoLatin2' | 'mottoTranslation'>;

const MusicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3v12m0 0-4-4m4 4 4-4M4 21h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** `motto` is the School motto, kept with the History of the School page. */
export const SchoolAnthemView: React.FC<{ content: AnthemContent; motto: Motto }> = ({ content, motto }) => {
  const embed = schoolAnthemHelper.embedUrl(content.video);
  const stanzas = schoolAnthemHelper.stanzas(content.lyrics);
  return (
    <>
      <PageCrumb trail={text.crumb} />

      <PageHero
        content={content}
        actions={
          <>
            <a className="btn btn-primary" href={`#${text.ids.lyrics}`}>
              {text.readLyrics}
            </a>
            {content.downloads.length > 0 && (
              <a className="btn btn-secondary" href={`#${text.ids.download}`}>
                {text.downloadAudio}
              </a>
            )}
          </>
        }
        media={
          embed && (
            <>
              <div className="video-frame">
                <iframe
                  id={text.ids.video}
                  src={embed}
                  title={text.videoTitle}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <a className="video-alt" href={schoolAnthemHelper.watchUrl(content.video)} target="_blank" rel="noopener noreferrer">
                {text.videoAlt}
              </a>
            </>
          )
        }
      />

      {content.downloads.length > 0 && (
        <section className="content-section tint-gold" id={text.ids.download} style={{ paddingTop: 56, paddingBottom: 56 }}>
          <div className="wrap">
            <SectionHead centered wide eyebrow={content.downloadsEyebrow} title={content.downloadsTitle} />
            <div className="dl-grid" style={{ marginTop: 28 }}>
              {content.downloads.map((item, i) => (
                <a className="dl-card" href={item.file} download key={`${i}-${item.file}`}>
                  <span className="dl-icon">
                    <MusicIcon />
                  </span>
                  <span className="dl-body">
                    <strong>{item.label}</strong>
                    {item.note && <small>{item.note}</small>}
                  </span>
                  <span className="dl-act">
                    {text.download} <DownloadIcon />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        className="content-section"
        id={text.ids.lyrics}
        style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="wrap">
          <SectionHead centered wide eyebrow={content.lyricsEyebrow} title={content.lyricsTitle} />
          {embed && <AnthemPlayer videoId={text.ids.video} sectionId={text.ids.lyrics} />}
          <div className="lyrics-panel">
            <div className="lyrics-body">
              {stanzas.map((lines, i) => (
                <div className="stanza" key={i}>
                  {lines.map((line, j) => (
                    <p key={j}>{line}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {motto.mottoLatin1 && (
        <section className="content-section tint-navy-soft motto-section">
          <div className="wrap">
            <MottoFigure
              variant="band"
              latin={[motto.mottoLatin1, motto.mottoLatin2]}
              translation={motto.mottoTranslation}
              caption={text.mottoCaption}
            />
          </div>
        </section>
      )}

      <CtaBand content={content}>
        <Link className="btn btn-gold" href={text.becomeMember.href}>
          {text.becomeMember.label}
        </Link>
        <Link className="btn btn-secondary" href={text.gallery.href}>
          {text.gallery.label}
        </Link>
      </CtaBand>
    </>
  );
};

export default SchoolAnthemView;
