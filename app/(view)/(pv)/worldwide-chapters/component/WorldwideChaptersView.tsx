import React from 'react';
import { ComingSoonLayout } from '@/app/(view)/common/component/ComingSoonLayout';
import type { ComingSoonContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { worldwideChaptersContent } from '../content';

export const WorldwideChaptersView: React.FC<{ content: ComingSoonContent }> = ({ content }) => <ComingSoonLayout content={content} config={worldwideChaptersContent} />;

export default WorldwideChaptersView;
