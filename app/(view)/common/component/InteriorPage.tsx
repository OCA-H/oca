import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Lightbox } from './Lightbox';

/**
 * The frame of an interior page: header (with `route`'s menu group lit), the page itself under the
 * template's `page-…` id (which its styles key off), the footer, and the photo lightbox.
 */
export const InteriorPage: React.FC<{ route: string; children: React.ReactNode }> = ({ route, children }) => (
  <>
    <Header activeRoute={route} />
    <main id="app">
      <div className="page is-active" id={`page-${route}`}>
        {children}
      </div>
    </main>
    <Footer />
    <Lightbox />
  </>
);

export default InteriorPage;
