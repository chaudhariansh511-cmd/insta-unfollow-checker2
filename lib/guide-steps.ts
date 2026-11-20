export type MockRow = {
  label: string
  sub?: string
  highlight?: boolean
}

export type MockScreen =
  | { kind: 'profile'; title: string }
  | { kind: 'list'; title: string; rows: MockRow[] }

export type GuideStep = {
  id: string
  title: string
  body: string
  /**
   * Optional real screenshot. Drop a file in /public/images (e.g. /images/step1.png)
   * or paste any image URL here. When empty, the built-in phone mockup is shown.
   */
  image: string
  imageAlt: string
  screen: MockScreen
}

export const guideSteps: GuideStep[] = [
  {
    id: 'step-1',
    title: 'Open your profile menu',
    body: 'In the Instagram app, go to your profile and tap the menu icon (three lines) in the top-right corner, then open Settings and activity.',
    image: '',
    imageAlt: 'Instagram profile screen with the menu icon highlighted in the top-right corner',
    screen: { kind: 'profile', title: 'your_username' },
  },
  {
    id: 'step-2',
    title: 'Go to Accounts Center',
    body: 'At the top of Settings and activity, tap the Accounts Center card.',
    image: '',
    imageAlt: 'Settings and activity screen with Accounts Center highlighted',
    screen: {
      kind: 'list',
      title: 'Settings and activity',
      rows: [
        { label: 'Accounts Center', sub: 'Password, security, personal details', highlight: true },
        { label: 'Saved' },
        { label: 'Archive' },
        { label: 'Your activity' },
        { label: 'Notifications' },
      ],
    },
  },
  {
    id: 'step-3',
    title: 'Your information and permissions',
    body: 'Inside Accounts Center, scroll to Account settings and tap Your information and permissions.',
    image: '',
    imageAlt: 'Accounts Center screen with Your information and permissions highlighted',
    screen: {
      kind: 'list',
      title: 'Accounts Center',
      rows: [
        { label: 'Profiles' },
        { label: 'Connected experiences' },
        { label: 'Password and security' },
        { label: 'Personal details' },
        { label: 'Your information and permissions', highlight: true },
      ],
    },
  },
  {
    id: 'step-4',
    title: 'Download your information',
    body: 'Tap Download your information, then Download or transfer information, and pick your Instagram account.',
    image: '',
    imageAlt: 'Your information and permissions screen with Download your information highlighted',
    screen: {
      kind: 'list',
      title: 'Your information',
      rows: [
        { label: 'Access your information' },
        { label: 'Download your information', highlight: true },
        { label: 'Transfer a copy of your information' },
        { label: 'Search history' },
      ],
    },
  },
  {
    id: 'step-5',
    title: 'Select JSON & Followers and following',
    body: 'Choose Some of your information, tick Followers and following, select Download to device, set Format to JSON and Date range to All time.',
    image: '',
    imageAlt: 'Export options screen with Followers and following and JSON format highlighted',
    screen: {
      kind: 'list',
      title: 'File options',
      rows: [
        { label: 'Followers and following', sub: 'Selected', highlight: true },
        { label: 'Date range', sub: 'All time' },
        { label: 'Format', sub: 'JSON', highlight: true },
        { label: 'Media quality', sub: 'Medium' },
      ],
    },
  },
]
