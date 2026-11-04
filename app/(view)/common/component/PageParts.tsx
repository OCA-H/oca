import React from 'react';
import Link from 'next/link';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import type { PageCtaContent, PageHeroContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';

// The pieces most interior pages are built from, in the template's markup: the breadcrumb, the
// banner, the closing green band, and text an admin typed with paragraphs and **bold**.

export interface CrumbStep {
  label: string;
  href?: string;
}

/** Home / About OCA / Batch Coordinators. Steps with an href are links. */
export const PageCrumb: React.FC<{ trail: CrumbStep[] }> = ({ trail }) => (
  <nav className="crumb" aria-label="Breadcrumb">
    <div className="wrap">
      <Link href={ROUTES.HOME}>Home</Link>
      {trail.map((step) => (
        <React.Fragment key={step.label}>
          <span className="sep">/</span>
          {step.href ? <Link href={step.href}>{step.label}</Link> : <span>{step.label}</span>}
        </React.Fragment>
      ))}
    </div>
  </nav>
);

export type TileTone = 'duo-navy' | 'duo-teal' | 'duo-gold';

/** A photo with the template's colour wash and, optionally, a line over its bottom edge. */
export const PhotoTile: React.FC<{ src: string; alt: string; caption?: string; tone?: TileTone; eager?: boolean }> = ({
  src,
  alt,
  caption,
  tone = 'duo-teal',
  eager,
}) => (
  <div className={`photo-tile ${tone}`}>
    <img className="tile-img" src={src} alt={alt} loading={eager ? undefined : 'lazy'} decoding="async" />
    {caption && (
      <div className="tile-caption">
        <div className="t">{caption}</div>
      </div>
    )}
  </div>
);

interface PageHeroProps {
  content: Pick<PageHeroContent, 'eyebrow' | 'title' | 'lead'> & Partial<Pick<PageHeroContent, 'image' | 'imageAlt' | 'imageCaption'>>;
  /** The buttons under the intro. */
  actions?: React.ReactNode;
  /** What sits on the right instead of the banner photo. */
  media?: React.ReactNode;
  tone?: TileTone;
  /** An extra class on the section, e.g. "by-hero". */
  className?: string;
}

/** The banner: eyebrow, heading, intro and buttons, with the banner photo (or `media`) beside them. */
export const PageHero: React.FC<PageHeroProps> = ({ content, actions, media, tone, className }) => (
  <section className={`page-hero${className ? ` ${className}` : ''}`}>
    <div className="wrap">
      <div>
        {content.eyebrow && <span className="eyebrow">{content.eyebrow}</span>}
        <h1>{content.title}</h1>
        {content.lead && <p className="lead">{content.lead}</p>}
        {actions && <div className="page-hero-actions">{actions}</div>}
      </div>
      {(media || content.image) && (
        <div className="page-hero-media">
          {media ?? <PhotoTile src={content.image!} alt={content.imageAlt ?? ''} caption={content.imageCaption} tone={tone} eager />}
        </div>
      )}
    </div>
  </section>
);

/** The closing green band. Short headings stay on one line, as in the template. */
export const CtaBand: React.FC<{ content: PageCtaContent; children?: React.ReactNode }> = ({ content, children }) => (
  <section className="cta-band">
    <div className="wrap">
      <div>
        {content.ctaEyebrow && <span className="eyebrow">{content.ctaEyebrow}</span>}
        <h2 className={content.ctaTitle.length <= 34 ? 'one-line' : undefined}>{content.ctaTitle}</h2>
        {content.ctaText && <p>{content.ctaText}</p>}
      </div>
      {children && <div className="cta-band-actions">{children}</div>}
    </div>
  </section>
);

/** Eyebrow, heading and intro over a section; `centered` centres it, and `wide` lets it run the full width. */
export const SectionHead: React.FC<{
  eyebrow?: string;
  title: string;
  intro?: string;
  centered?: boolean;
  wide?: boolean;
  style?: React.CSSProperties;
}> = ({ eyebrow, title, intro, centered, wide, style }) => (
  <div
    className="section-head stack"
    style={{
      ...(centered && { textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }),
      ...(wide && { maxWidth: 'none' }),
      ...style,
    }}
  >
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
    <h2>{title}</h2>
    {intro && <p style={centered ? { marginLeft: 'auto', marginRight: 'auto' } : undefined}>{intro}</p>}
  </div>
);

/**
 * A line of admin-typed text with **bold** and *italic* words, as React nodes (never as HTML, so
 * nothing typed in the admin panel can inject markup).
 */
export const RichText: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (/^\*[^*]+\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
};

/** Admin-typed text split into paragraphs at blank lines. */
export const Paragraphs: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text
      .split(/\n\s*\n/)
      .map((para) => para.trim())
      .filter(Boolean)
      .map((para, i) => (
        <p key={i}>
          <RichText text={para} />
        </p>
      ))}
  </>
);

/** The box for a page that is on its way, with a button to the Secretariat. */
export const ComingSoonBox: React.FC<{ title: string; text: string; action: React.ReactNode; pill?: boolean; narrow?: boolean }> = ({
  title,
  text,
  action,
  pill = true,
  narrow = true,
}) => (
  <div className="ph-soon" style={narrow ? { maxWidth: 760, margin: '0 auto' } : undefined}>
    <div>
      {pill && <span className="pill soon">Coming soon</span>}
      <h3>{title}</h3>
      {text && <p>{text}</p>}
    </div>
    {action}
  </div>
);

/** "Meanwhile: Find your batchmates · Become a member", under a coming-soon box. */
export const MeanwhileLinks: React.FC<{ links: { label: string; href: string }[] }> = ({ links }) => (
  <p className="note-band" style={{ marginTop: 22, maxWidth: 760, textAlign: 'center' }}>
    <strong>Meanwhile:</strong>{' '}
    {links.map((link, i) => (
      <React.Fragment key={link.href}>
        {i > 0 && ' · '}
        <Link href={link.href}>{link.label}</Link>
      </React.Fragment>
    ))}
  </p>
);

/** The lock icon and "encrypted" line under the Contribute buttons. */
export const SecurePaymentNote: React.FC<{ small?: boolean }> = ({ small }) => (
  <p className={`tbf-ssl${small ? ' tbf-ssl-sm' : ''}`}>
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
    <span>The payment is encrypted and transmitted securely with an SSL protocol.</span>
  </p>
);

/** The School motto, as a plaque (History of the School) or a band (School Anthem). */
export const MottoFigure: React.FC<{
  latin: [string, string];
  translation: string;
  caption?: string;
  variant: 'plaque' | 'band';
  style?: React.CSSProperties;
}> = ({ latin, translation, caption, variant, style }) => (
  <figure className={`motto motto--${variant}`} style={style}>
    <div className="motto-orn" aria-hidden="true">
      <i></i>
    </div>
    <p className="motto-latin" lang="la">
      {latin.filter(Boolean).map((phrase, i) => (
        <React.Fragment key={phrase}>
          {i > 0 && ' '}
          <span>{phrase}</span>
        </React.Fragment>
      ))}
    </p>
    {translation && <p className="motto-trans">{translation}</p>}
    {caption && <figcaption className="motto-cap">{caption}</figcaption>}
  </figure>
);
