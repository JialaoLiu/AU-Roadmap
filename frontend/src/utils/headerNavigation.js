export const megaMenuItems = [
  {
    id: 'study',
    label: 'Study',
    columns: [
      {
        type: 'featured',
        title: 'Find Your Degree',
        description: 'Explore our range of undergraduate and postgraduate programs at Adelaide University.',
        cta: { text: 'Explore Programs', to: '/explore' },
      },
      {
        type: 'links',
        title: 'Course Types',
        links: [
          { label: 'Undegraduate Degree', to: '/explore?level=undergraduate' },
          { label: 'Postgraduate Coursework', to: '/explore?level=postgraduate' },
          { label: 'Postgraduate Research', to: '/explore?level=research' },
          { label: 'Program Recommendation', to: '/explore/quiz' },
        ],
      },
      {
        type: 'links',
        title: 'International Students',
        links: [
          { label: 'How To Apply', to: '/explore/apply' },
          { label: 'Life In Adelaide', to: '/explore/campus-life' },
        ],
      },
      {
        type: 'links',
        title: 'Careers',
        links: [
          { label: 'Career Outcomes', to: '/explore/careers' },
        ],
      },
    ],
  },
  {
    id: 'research',
    label: 'Research',
    columns: [
      {
        type: 'featured',
        title: 'Our Research & Innovation',
        description: 'Discover world-leading research and connect with industry partners across disciplines.',
        cta: { text: 'Explore Research', to: '/research' },
      },
      {
        type: 'links',
        title: 'Our Research',
        links: [
          { label: 'Our Performance', to: '/research#performance' },
          { label: 'Research Institutes', to: '/research/institutes' },
          { label: 'Research Impact', to: '/research/impact' },
        ],
      },
      {
        type: 'links',
        title: 'Connect',
        links: [
          { label: 'Partner With Us', to: '/research/connect' },
          { label: 'Research Events', to: '/research/events' },
        ],
      },
      {
        type: 'links',
        title: 'Research Support',
        links: [
          { label: 'Graduate Research School', to: '/research/support#graduate-school' },
        ],
      },
    ],
  },
  {
    id: 'engage',
    label: 'Engage',
    columns: [
      {
        type: 'featured',
        title: 'Connect & Engage',
        description: 'Join our alumni network, explore partnership opportunities, and connect with the Adelaide community.',
        cta: { text: 'Meet Our Alumni', to: '/student/alumni' },
      },
      {
        type: 'links',
        title: 'Alumni',
        links: [
          { label: 'Reconnect', to: '/student/alumni' },
          { label: 'Alumni Networks', to: '/student/alumni#networks' },
          { label: 'Alumni News & Events', to: '/student/alumni#events' },
          { label: 'Awards & Recognition', to: '/student/alumni#awards' },
          { label: 'Become A Volunteer', to: '/student/alumni#volunteer' },
        ],
      },
      {
        type: 'links',
        title: 'Give to Adelaide',
        links: [
          { label: 'Give Now', href: 'https://www.adelaide.edu.au/giving', external: true },
          { label: 'Impact Of Giving', href: 'https://www.adelaide.edu.au/giving/impact', external: true },
        ],
      },
      {
        type: 'links',
        title: 'More Information',
        links: [
          { label: 'Industry & Government', to: '/student/industry' },
          { label: 'Partnerships', to: '/student/industry#partners' },
          { label: 'Global Engagement', href: 'https://www.adelaide.edu.au/global', external: true },
          { label: 'Community', to: '/explore/campus-life' },
        ],
      },
    ],
  },
  {
    id: 'about',
    label: 'About the Uni',
    columns: [
      {
        type: 'featured',
        title: 'Adelaide University',
        description: 'Learn about our history, mission, and vision for the future of education and research.',
        cta: { text: 'Learn More', href: 'https://www.adelaide.edu.au/about', external: true },
      },
      {
        type: 'links',
        title: 'University Profile',
        links: [
          { label: 'History', href: 'https://www.adelaide.edu.au/about/history', external: true },
          { label: 'Mission & Focus', href: 'https://www.adelaide.edu.au/about/mission', external: true },
          { label: 'The City Of Adelaide', to: '/explore/campus-life' },
          { label: 'Awards & Achievements', href: 'https://www.adelaide.edu.au/about/awards', external: true },
          { label: 'World Rankings', href: 'https://www.adelaide.edu.au/about/rankings', external: true },
        ],
      },
      {
        type: 'links',
        title: 'Leadership & Structure',
        links: [
          { label: 'Faculties & Divisions', href: 'https://www.adelaide.edu.au/faculties', external: true },
          { label: 'Governance', href: 'https://www.adelaide.edu.au/about/governance', external: true },
          { label: 'Vice-Chancellor & President', href: 'https://www.adelaide.edu.au/vice-chancellor', external: true },
        ],
      },
      {
        type: 'links',
        title: 'More Information',
        links: [
          { label: 'News & Events', href: 'https://www.adelaide.edu.au/newsroom', external: true },
          { label: 'University Contacts', href: 'https://www.adelaide.edu.au/directory', external: true },
          { label: 'Safer Campus Community', href: 'https://www.adelaide.edu.au/safer-campus', external: true },
          { label: 'Job Opportunities', href: 'https://www.adelaide.edu.au/jobs', external: true },
        ],
      },
    ],
  },
];
