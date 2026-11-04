import React from 'react';
import { ComingSoonLayout } from '@/app/(view)/common/component/ComingSoonLayout';
import type { ComingSoonContent } from '@/app/api/(features)/(pview)/site/schema/pageSections';
import { networkingContent } from '../content';

export const NetworkingView: React.FC<{ content: ComingSoonContent }> = ({ content }) => <ComingSoonLayout content={content} config={networkingContent} />;

export default NetworkingView;
