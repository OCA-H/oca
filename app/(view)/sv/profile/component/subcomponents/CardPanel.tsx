'use client';

import React from 'react';
import { profileContent } from '../../content';
import { profileHelper } from '../../helper';
import type { MembershipCard } from '../../services';
import { PanelHead } from './PanelHead';
import { ProfileIcon } from './ProfileIcon';

interface CardPanelProps {
  card: MembershipCard | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  hidden: boolean;
  onBack: () => void;
}

const Bar: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <span className={`mp-skel ${className}`} style={style} aria-hidden="true" />
);

/** The card and its details, in the same boxes the loaded card fills. */
export const CardSkeleton: React.FC = () => (
  <div className="mp-ecard-wrap" aria-hidden="true">
    <div className="mp-ecard mp-ecard--skel">
      <div className="mp-ecard-top">
        <Bar className="mp-skel--dark mp-skel-crest" />
        <span className="mp-ecard-org">
          <Bar className="mp-skel--dark mp-skel-line" style={{ width: 170 }} />
          <Bar className="mp-skel--dark mp-skel-line" style={{ width: 130, marginTop: 8, height: 9 }} />
        </span>
      </div>
      <div className="mp-ecard-body">
        <Bar className="mp-skel--dark mp-skel-line" style={{ width: '62%', height: 24 }} />
        <div className="mp-ecard-meta">
          {[60, 96, 64].map((width) => (
            <span key={width}>
              <Bar className="mp-skel--dark mp-skel-line" style={{ width: 40, height: 8 }} />
              <Bar className="mp-skel--dark mp-skel-line" style={{ width, marginTop: 6 }} />
            </span>
          ))}
        </div>
      </div>
    </div>
    <div className="mp-ecard-side">
      <div className="mp-dl">
        {[72, 120, 96, 110].map((width, i) => (
          <React.Fragment key={i}>
            <Bar className="mp-skel-line" style={{ width: 80, marginTop: 4 }} />
            <Bar className="mp-skel-line" style={{ width, marginTop: 4 }} />
          </React.Fragment>
        ))}
      </div>
      <div className="mp-btns">
        <Bar className="mp-skel-btn" style={{ flex: '1 1 150px' }} />
        <Bar className="mp-skel-btn" style={{ flex: '1 1 150px' }} />
      </div>
    </div>
  </div>
);

export const CardPanel: React.FC<CardPanelProps> = ({ card: data, isLoading, error, onRetry, hidden, onBack }) => {
  const { card } = profileContent;
  const { labels } = card;
  // The print stylesheet keeps only the card; "Download" opens the same dialog to save it as a PDF.
  const printCard = () => window.print();

  const body = () => {
    if (isLoading) {
      return (
        <div role="status" aria-busy="true">
          <span className="mp-sr">Loading your membership card…</span>
          <CardSkeleton />
        </div>
      );
    }
    if (error || !data) {
      return (
        <div className="mp-fade">
          <p className="ms-error" role="alert">
            {error || card.loadError}
          </p>
          <button className="btn btn-secondary" type="button" onClick={onRetry} style={{ marginTop: 16 }}>
            {card.retry}
          </button>
        </div>
      );
    }

    const isValid = data.status === 'active';
    const validity = isValid ? data.validity || card.activeLabel : card.notValid;
    const summary = [data.membershipType, data.batchYear && `Batch of ${data.batchYear}`].filter(Boolean).join(' · ');

    return (
      <div className="mp-ecard-wrap mp-fade">
        <div
          className={`mp-ecard${isValid ? '' : ' is-invalid'}`}
          role="img"
          aria-label={`${card.org} membership card for ${data.name}, ${summary}, member ID ${data.memberId}, valid ${validity}`}
        >
          <div className="mp-ecard-top">
            <span className="mp-ecard-crest" aria-hidden="true" />
            <span className="mp-ecard-org">
              <b>{card.org}</b>
              <small>{card.school}</small>
            </span>
            <span className="mp-ecard-tag">{isValid ? data.membershipType : card.notValid}</span>
          </div>
          <div className="mp-ecard-body">
            <span className="mp-ecard-name">{data.name}</span>
            <div className="mp-ecard-meta">
              {data.batchYear && (
                <span>
                  <small>{labels.batch}</small>
                  <b>{data.batchYear}</b>
                </span>
              )}
              <span>
                <small>{labels.memberId}</small>
                <b>{data.memberId}</b>
              </span>
              <span>
                <small>{labels.valid}</small>
                <b>{validity}</b>
              </span>
            </div>
          </div>
        </div>
        <div className="mp-ecard-side">
          {!isValid && <p className="ms-error" style={{ marginBottom: 20 }}>{card.notValidNote}</p>}
          <dl className="mp-dl">
            <dt>{labels.member}</dt>
            <dd>{data.name}</dd>
            <dt>{labels.membership}</dt>
            <dd>{data.membershipType}</dd>
            <dt>{labels.memberId}</dt>
            <dd>{data.memberId}</dd>
            {data.house && (
              <>
                <dt>{labels.house}</dt>
                <dd>{data.house}</dd>
              </>
            )}
            <dt>{labels.memberSince}</dt>
            <dd>{profileHelper.formatDate(data.memberSince)}</dd>
            {data.payment && (
              <>
                <dt>{labels.order}</dt>
                <dd>{data.payment.orderId}</dd>
                <dt>{labels.amount}</dt>
                <dd>
                  {profileHelper.formatAmount(data.payment.amount, data.payment.currency)}
                  {data.payment.paymentMode && ` · ${labels.paidVia} ${data.payment.paymentMode}`}
                </dd>
              </>
            )}
          </dl>
          <div className="mp-btns">
            <button className="btn btn-primary" type="button" onClick={printCard} disabled={!isValid}>
              <ProfileIcon name="download" />
              Download card
            </button>
            <button className="btn btn-secondary" type="button" onClick={printCard} disabled={!isValid}>
              <ProfileIcon name="print" />
              Print
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="mp-panel" id="mp-card" aria-labelledby="mp-t-card" hidden={hidden}>
      <PanelHead panel="card" title={card.title} lead={card.lead} onBack={onBack} />
      {body()}
    </section>
  );
};

export default CardPanel;
