import React from 'react';
import { ComingSoonLayout } from '@/app/(view)/common/component/ComingSoonLayout';
import type { ComingSoonContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { alumniServicesContent } from '../content';

export const AlumniServicesView: React.FC<{ content: ComingSoonContent }> = ({ content }) => <ComingSoonLayout content={content} config={alumniServicesContent} />;

export default AlumniServicesView;
