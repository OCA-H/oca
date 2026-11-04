import React from 'react';
import Link from 'next/link';
import type { ComingSoonContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { MailtoLink } from './ContactLinks';
import { ComingSoonBox, MeanwhileLinks, PageCrumb, PageHero, type CrumbStep, type TileTone } from './PageParts';

/** A button: a page on the site (`href`), or an email to the Secretariat (`subject`). */
export interface ComingSoonAction {
  label: string;
  href?: string;
  subject?: string;
}

/** What differs between the coming-soon pages, beside the text edited in the admin panel. */
export interface ComingSoonConfig {
  crumb: CrumbStep[];
  tone?: TileTone;
  /** The banner's two buttons, primary first. */
  heroActions: [ComingSoonAction, ComingSoonAction];
  /** The button in the coming-soon box. */
  boxAction: ComingSoonAction;
  meanwhile: { label: string; href: string }[];
}

const ActionLink: React.FC<{ action: ComingSoonAction; className: string }> = ({ action, className }) =>
  action.href ? (
    <Link className={className} href={action.href}>
      {action.label}
    </Link>
  ) : (
    <MailtoLink className={className} subject={action.subject}>
      {action.label}
    </MailtoLink>
  );

/** A page that is on its way: its banner, the coming-soon box, and where to go meanwhile. */
export const ComingSoonLayout: React.FC<{ content: ComingSoonContent; config: ComingSoonConfig; children?: React.ReactNode }> = ({
  content,
  config,
  children,
}) => (
  <>
    <PageCrumb trail={config.crumb} />

    <PageHero
      content={content}
      tone={config.tone}
      actions={
        <>
          <ActionLink action={config.heroActions[0]} className="btn btn-primary" />
          <ActionLink action={config.heroActions[1]} className="btn btn-secondary" />
        </>
      }
    />

    <section className="content-section">
      <div className="wrap">
        <ComingSoonBox title={content.soonTitle} text={content.soonText} action={<ActionLink action={config.boxAction} className="btn btn-primary" />} />
        {config.meanwhile.length > 0 && <MeanwhileLinks links={config.meanwhile} />}
      </div>
    </section>

    {children}
  </>
);

export default ComingSoonLayout;
