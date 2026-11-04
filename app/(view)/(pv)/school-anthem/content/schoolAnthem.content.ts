import { ROUTES } from '@/app/(view)/common/helper/routes';

/** The page's fixed wording; the rest is edited in the admin panel (Gallery → School Anthem). */
export const schoolAnthemContent = {
  crumb: [{ label: 'School Anthem' }],
  readLyrics: 'Read the lyrics',
  downloadAudio: 'Download the audio',
  videoTitle: 'The St. Columba’s School Anthem',
  videoAlt: 'Not loading? Watch on YouTube ↗',
  download: 'Download',
  listen: 'Listen to the Anthem',
  tapToPlay: 'Tap play to hear it',
  playing: 'Playing now',
  loading: 'Loading…',
  playAria: 'Play the anthem',
  pauseAria: 'Pause the anthem',
  mottoCaption: 'The motto of St. Columba’s School, and a thread that runs through the anthem.',
  becomeMember: { label: 'Become a Member', href: ROUTES.MEMBERSHIP },
  gallery: { label: 'Check Gallery', href: ROUTES.EVENT_PHOTOGRAPHS },
  /** The ids the player and the "jump to" buttons use. */
  ids: { video: 'anthemVideo', lyrics: 'lyrics', download: 'download' },
};
