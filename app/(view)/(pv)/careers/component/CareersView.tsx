import React from 'react';
import { ComingSoonLayout } from '@/app/(view)/common/component/ComingSoonLayout';
import type { ComingSoonContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { careersContent } from '../content';

export const CareersView: React.FC<{ content: ComingSoonContent }> = ({ content }) => <ComingSoonLayout content={content} config={careersContent} />;

export default CareersView;
