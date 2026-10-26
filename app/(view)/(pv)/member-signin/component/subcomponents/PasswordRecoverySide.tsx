import React from 'react';
import Link from 'next/link';

interface PasswordRecoverySideProps {
  eyebrow: string;
  title: string;
  steps: ReadonlyArray<{ title: string; desc: string }>;
  footQuestion: string;
  footLinkText: string;
  footLinkHref: string;
}

/** The dark crest panel of the sign-in card, with numbered steps. */
export const PasswordRecoverySide: React.FC<PasswordRecoverySideProps> = ({
  eyebrow,
  title,
  steps,
  footQuestion,
  footLinkText,
  footLinkHref,
}) => (
  <aside className="si-side">
    <div className="si-crest" role="img" aria-label="Old Columbans Association crest" />
    <span className="eyebrow">{eyebrow}</span>
    <h2>{title}</h2>
    <ol className="si-list si-steps">
      {steps.map((step, i) => (
        <li key={step.title}>
          <span className="si-ico">{i + 1}</span>
          <div>
            <b>{step.title}</b>
            <span className="d">{step.desc}</span>
          </div>
        </li>
      ))}
    </ol>
    <p className="si-side-foot">
      {footQuestion}
      <Link href={footLinkHref}>{footLinkText}</Link>
    </p>
  </aside>
);

export default PasswordRecoverySide;
