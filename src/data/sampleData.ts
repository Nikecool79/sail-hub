export const teams = [
  { id: 'green' as const, name: 'Green Team', ageRange: '6–9 years', description: 'First steps on the water — learn the basics and have fun!', color: '#2E7D32' },
  { id: 'blue' as const, name: 'Blue Team', ageRange: '9–12 years', description: 'Build confidence and racing skills on the open water.', color: '#1565C0' },
  { id: 'red' as const, name: 'Red Team', ageRange: '12–15 years', description: 'Compete at a higher level — regattas and championships.', color: '#C62828' },
];

export const navItems = [
  { title: 'Dashboard', url: '/dashboard', icon: 'LayoutDashboard' },
  { title: 'Calendar', url: '/calendar', icon: 'CalendarDays' },
  { title: 'Events & Maps', url: '/events', icon: 'MapPin' },
  { title: 'Weather', url: '/weather', icon: 'CloudSun' },
  { title: 'Live Cameras', url: '/cameras', icon: 'Video' },
  { title: 'Coaches & Team', url: '/coaches', icon: 'Users' },
  { title: 'Fleet', url: '/fleet', icon: 'Anchor' },
  { title: 'Club Contacts', url: '/contacts', icon: 'Phone' },
  { title: 'News', url: '/news', icon: 'Newspaper' },
  { title: 'Marketplace', url: '/marketplace', icon: 'ShoppingBag' },
  { title: 'Skill Progression', url: '/skills', icon: 'TrendingUp' },
  { title: 'Safety Checklist', url: '/safety', icon: 'ShieldCheck' },
  { title: 'Subscribe', url: '/subscribe', icon: 'Bell' },
  { title: 'Sponsors', url: '/sponsors', icon: 'Heart' },
];

export const events = [
  { id: 1, name: 'Spring Regatta', date: '2026-04-18', endDate: '2026-04-19', type: 'regatta', location: 'GKSS Langedrag', description: 'Annual spring regatta for all Optimist classes. Great first regatta experience.', team: null },
  { id: 2, name: 'Weekend Training', date: '2026-04-25', type: 'training', location: 'Kullavik Hamn', description: 'Regular weekend training session. Focus on tacking and jibing.', team: 'green' },
  { id: 3, name: 'Marstrand Cup', date: '2026-05-16', endDate: '2026-05-17', type: 'championship', location: 'Marstrand', description: 'West coast championship for Optimist sailors.', team: null },
  { id: 4, name: 'Midsummer Sail', date: '2026-06-20', type: 'social', location: 'Kullavik Hamn', description: 'Fun sailing day before midsummer. BBQ included!', team: null },
  { id: 5, name: 'Summer Camp Week 1', date: '2026-06-29', endDate: '2026-07-03', type: 'training', location: 'Kullavik Hamn', description: 'Intensive week of sailing. Perfect for improving skills.', team: 'blue' },
  { id: 6, name: 'Sandhamn Regatta', date: '2026-07-11', endDate: '2026-07-12', type: 'regatta', location: 'Sandhamn', description: 'Popular summer regatta on the east coast.', team: null },
  { id: 7, name: 'National Championship', date: '2026-08-08', endDate: '2026-08-10', type: 'championship', location: 'Marstrand', description: 'Swedish National Optimist Championship.', team: 'red' },
  { id: 8, name: 'End of Season Party', date: '2026-09-12', type: 'social', location: 'Kullavik Hamn', description: 'Celebrate a great season with awards and pizza!', team: null },
];

export const venues = [
  { name: 'Kullavik Hamn', lat: 57.48, lng: 11.88, address: 'Hamnvägen 12, 429 44 Kullavik', parking: 'Free parking at harbor', facilities: 'Changing rooms, boat storage, club house', isHome: true },
  { name: 'GKSS Langedrag', lat: 57.66, lng: 11.88, address: 'Langedragsvägen 2, 426 71 Göteborg', parking: 'Limited parking, arrive early', facilities: 'Full marina, restaurant, showers' },
  { name: 'Sandhamn', lat: 59.28, lng: 18.92, address: 'Sandhamn, Stockholm Archipelago', parking: 'Ferry access only', facilities: 'Guest harbor, shops, restaurants' },
  { name: 'Marstrand', lat: 57.89, lng: 11.58, address: 'Marstrand, 442 66', parking: 'Mainland parking + ferry', facilities: 'Historic sailing venue, full facilities' },
];

export const coaches = [
  { name: 'Erik Lindqvist', role: 'Head Coach', phone: '+46 70 123 4567', email: 'erik@klubben.se', bio: 'Former Olympic sailor with 15 years of coaching experience. Passionate about youth development.', initials: 'EL' },
  { name: 'Anna Bergström', role: 'Green Team Coach', phone: '+46 70 234 5678', email: 'anna@klubben.se', bio: 'Certified Level 3 sailing instructor. Specializes in introducing young children to the sport.', initials: 'AB' },
  { name: 'Magnus Svensson', role: 'Blue Team Coach', phone: '+46 70 345 6789', email: 'magnus@klubben.se', bio: 'Competitive sailor and tactician. Focuses on building racing skills and confidence.', initials: 'MS' },
  { name: 'Sofia Karlsson', role: 'Red Team Coach', phone: '+46 70 456 7890', email: 'sofia@klubben.se', bio: 'National team experience. Prepares advanced sailors for championship-level competition.', initials: 'SK' },
  { name: 'Lars Johansson', role: 'Safety Officer', phone: '+46 70 567 8901', email: 'lars@klubben.se', bio: 'Motorboat license instructor and first aid certified. Ensures safe conditions on the water.', initials: 'LJ' },
  { name: 'Karin Nilsson', role: 'Assistant Coach', phone: '+46 70 678 9012', email: 'karin@klubben.se', bio: 'Former Optimist sailor turned coach. Great at connecting with young sailors.', initials: 'KN' },
];

export const contacts = [
  { name: 'Per Andersson', role: 'Club Chairman', phone: '+46 70 111 2233', email: 'per@klubben.se' },
  { name: 'Maria Olsson', role: 'Secretary', phone: '+46 70 222 3344', email: 'maria@klubben.se' },
  { name: 'Johan Ek', role: 'Treasurer', phone: '+46 70 333 4455', email: 'johan@klubben.se' },
  { name: 'Helena Strand', role: 'Youth Coordinator', phone: '+46 70 444 5566', email: 'helena@klubben.se' },
  { name: 'Anders Berg', role: 'Facilities Manager', phone: '+46 70 555 6677', email: 'anders@klubben.se' },
];

export const newsItems = [
  { id: 1, title: 'Season 2026 Registration Now Open!', date: '2026-03-01', body: 'Registration for the 2026 sailing season is now open. Sign up your child for Green, Blue, or Red team. Early bird discount available until March 31st.', team: null, pinned: true, author: 'Helena Strand' },
  { id: 2, title: 'New Boats Arriving in April', date: '2026-02-28', body: 'We are excited to announce that 6 new Optimist dinghies are being delivered in April. This will allow us to expand training capacity.', team: null, pinned: true, author: 'Per Andersson' },
  { id: 3, title: 'Green Team Spring Schedule', date: '2026-02-25', body: 'The Green Team spring training schedule is now published. Sessions start April 12th, every Saturday 10:00-12:00.', team: 'green', pinned: false, author: 'Anna Bergström' },
  { id: 4, title: 'Blue Team Weekend Camp', date: '2026-02-20', body: 'Sign up for the Blue Team intensive weekend camp on May 2-3. Focus on start techniques and mark rounding.', team: 'blue', pinned: false, author: 'Magnus Svensson' },
  { id: 5, title: 'Red Team Championship Prep', date: '2026-02-18', body: 'Advanced training sessions begin March 15th for Red Team sailors preparing for the National Championship.', team: 'red', pinned: false, author: 'Sofia Karlsson' },
  { id: 6, title: 'Volunteer Parents Needed', date: '2026-02-15', body: 'We need parent volunteers for safety boat duty during training sessions. No experience needed — training provided!', team: null, pinned: false, author: 'Lars Johansson' },
  { id: 7, title: 'Club House Renovation Complete', date: '2026-02-10', body: 'The club house renovation is finished! New changing rooms, a warming kitchen, and improved boat storage are now available.', team: null, pinned: false, author: 'Anders Berg' },
  { id: 8, title: 'Winter Social Photos', date: '2026-02-05', body: 'Photos from the winter social event are now on our Facebook page. Thank you everyone who attended!', team: null, pinned: false, author: 'Maria Olsson' },
];

export const marketplaceItems = [
  { id: 1, title: 'Optimist Dinghy — Race Ready', price: 8500, category: 'boat', condition: 'Good', seller: 'Erik P.', date: '2026-02-20', description: 'Well-maintained race-ready Optimist. New sail (2025). Minor hull scratches. Includes launching trolley.' },
  { id: 2, title: 'Optimist Sail — North Sails', price: 2200, category: 'sail', condition: 'Like New', seller: 'Anna K.', date: '2026-02-18', description: 'Used for one season only. North Sails racing sail in excellent condition.' },
  { id: 3, title: 'Kids Wetsuit 3mm — Size 140', price: 450, category: 'clothing', condition: 'Good', seller: 'Maria S.', date: '2026-02-15', description: 'Gill junior wetsuit, 3mm neoprene. Size 140 (approx age 9-10). No tears or damage.' },
  { id: 4, title: 'Buoyancy Aid — Junior M', price: 350, category: 'equipment', condition: 'Like New', seller: 'Johan L.', date: '2026-02-12', description: 'Zhik junior buoyancy aid, size M. Approved for racing. Worn twice.' },
  { id: 5, title: 'Spraytop — Gill Junior', price: 300, category: 'clothing', condition: 'Fair', seller: 'Sofia B.', date: '2026-02-10', description: 'Gill spraytop, junior size L. Still waterproof, some wear on cuffs.' },
  { id: 6, title: 'Mast and Boom Set', price: 1800, category: 'equipment', condition: 'Good', seller: 'Lars M.', date: '2026-02-08', description: 'Standard Optimist mast and boom. Good condition, suitable for training.' },
];

export const skills = {
  green: [
    { name: 'Board the boat safely', description: 'Get in and out of the Optimist without capsizing' },
    { name: 'Rig the sail', description: 'Set up the mast, boom, and sail with help' },
    { name: 'Steer with the tiller', description: 'Understand how the tiller controls direction' },
    { name: 'Sail in a straight line', description: 'Maintain a course with constant wind' },
    { name: 'Basic tacking', description: 'Turn the bow through the wind' },
    { name: 'Capsize recovery', description: 'Right the boat after capsizing' },
  ],
  blue: [
    { name: 'Independent rigging', description: 'Rig the boat fully without assistance' },
    { name: 'Tacking with speed', description: 'Execute smooth, fast tacks' },
    { name: 'Jibing', description: 'Turn the stern through the wind safely' },
    { name: 'Upwind sailing', description: 'Sail close-hauled efficiently' },
    { name: 'Racing starts', description: 'Position for a strong start at the line' },
    { name: 'Mark rounding', description: 'Round marks cleanly and tactically' },
    { name: 'Read the wind', description: 'Identify shifts and puffs on the water' },
  ],
  red: [
    { name: 'Advanced tactics', description: 'Race strategy and fleet positioning' },
    { name: 'Current awareness', description: 'Use tidal current to advantage' },
    { name: 'Heavy weather sailing', description: 'Sail confidently in strong winds' },
    { name: 'Protest procedures', description: 'Understand racing rules and protests' },
    { name: 'Boat maintenance', description: 'Care for and repair the Optimist' },
    { name: 'Mental preparation', description: 'Pre-race focus and confidence building' },
    { name: 'Regatta planning', description: 'Plan travel, logistics, and race day routines' },
  ],
};

export const safetyItems = [
  { category: 'Safety', icon: 'ShieldCheck', items: [
    { name: 'Buoyancy Aid / Life Jacket', description: 'Must be worn at all times on the water. CE-approved.', teams: ['green', 'blue', 'red'] },
    { name: 'Whistle', description: 'Attached to buoyancy aid for emergency signaling.', teams: ['green', 'blue', 'red'] },
    { name: 'Buddy system', description: 'Never sail alone. Always pair up.', teams: ['green'] },
  ]},
  { category: 'Clothing', icon: 'Shirt', items: [
    { name: 'Wetsuit or Drysuit', description: 'Appropriate for water temperature. 3mm minimum.', teams: ['green', 'blue', 'red'] },
    { name: 'Sailing gloves', description: 'Protect hands from rope burns.', teams: ['blue', 'red'] },
    { name: 'Neoprene boots', description: 'Keep feet warm and protected.', teams: ['green', 'blue', 'red'] },
    { name: 'Spraytop', description: 'Windproof outer layer for cold days.', teams: ['blue', 'red'] },
  ]},
  { category: 'Equipment', icon: 'Wrench', items: [
    { name: 'Bailer / Sponge', description: 'For removing water from the boat.', teams: ['green', 'blue', 'red'] },
    { name: 'Paddle', description: 'Emergency propulsion if wind dies.', teams: ['green', 'blue', 'red'] },
    { name: 'Tow line', description: 'For towing in emergencies.', teams: ['blue', 'red'] },
  ]},
  { category: 'Protection', icon: 'Sun', items: [
    { name: 'Sunscreen SPF 50+', description: 'Apply before going out. Reapply after swimming.', teams: ['green', 'blue', 'red'] },
    { name: 'Sunglasses with strap', description: 'UV protection with retainer strap.', teams: ['blue', 'red'] },
    { name: 'Hat / Cap', description: 'Sun protection for head. Secured with chin strap.', teams: ['green', 'blue', 'red'] },
  ]},
  { category: 'Nutrition', icon: 'Apple', items: [
    { name: 'Water bottle', description: 'Stay hydrated! Minimum 0.5L per session.', teams: ['green', 'blue', 'red'] },
    { name: 'Energy snack', description: 'Fruit, energy bar, or sandwich for longer sessions.', teams: ['blue', 'red'] },
  ]},
];

export const sponsors = {
  gold: [
    { name: 'Västkusten Marina', tagline: 'Your home on the water', description: 'Full-service marina with boat storage, repairs, and chandlery. Supporting youth sailing since 2010.' },
    { name: 'Seglarbutiken', tagline: 'Everything for the sailor', description: 'Sailing equipment and apparel. 10% discount for club members on all Optimist gear.' },
  ],
  silver: [
    { name: 'Kullavik Café', tagline: 'Fika by the sea' },
    { name: 'Nordic Sails', tagline: 'Performance sailmaking' },
    { name: 'Havets Gym', tagline: 'Strength for the sea' },
  ],
  bronze: [
    { name: 'Strandpizzerian' },
    { name: 'Kullavik Blommor' },
    { name: 'IT-Konsulten' },
    { name: 'Hamnen Kiosk' },
    { name: 'Fiskeboden' },
  ],
};

export const weatherData = {
  current: {
    temp: 14,
    feelsLike: 11,
    humidity: 72,
    precipitation: 0,
    uvIndex: 4,
    windSpeed: 12,
    windDirection: 225,
    conditions: 'Partly Cloudy',
    location: 'Kullavik Hamn',
  },
  hourly: [
    { hour: '08:00', temp: 12, wind: 8, icon: 'cloud-sun' },
    { hour: '09:00', temp: 13, wind: 10, icon: 'cloud-sun' },
    { hour: '10:00', temp: 14, wind: 12, icon: 'sun' },
    { hour: '11:00', temp: 15, wind: 14, icon: 'sun' },
    { hour: '12:00', temp: 15, wind: 13, icon: 'cloud-sun' },
    { hour: '13:00', temp: 15, wind: 12, icon: 'cloud' },
    { hour: '14:00', temp: 14, wind: 11, icon: 'cloud-sun' },
    { hour: '15:00', temp: 13, wind: 10, icon: 'cloud' },
  ],
  daily: [
    { day: 'Mon', high: 15, low: 9, wind: 12, icon: 'cloud-sun' },
    { day: 'Tue', high: 14, low: 8, wind: 18, icon: 'cloud-rain' },
    { day: 'Wed', high: 13, low: 7, wind: 15, icon: 'cloud' },
    { day: 'Thu', high: 16, low: 10, wind: 8, icon: 'sun' },
    { day: 'Fri', high: 17, low: 11, wind: 6, icon: 'sun' },
    { day: 'Sat', high: 16, low: 10, wind: 10, icon: 'cloud-sun' },
    { day: 'Sun', high: 15, low: 9, wind: 14, icon: 'cloud' },
  ],
};
