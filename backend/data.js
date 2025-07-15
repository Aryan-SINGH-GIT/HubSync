// In-memory data storage

const data = {
  clients: [
    {
      id: 'client-1',
      name: 'Zara India',
      contact: 'zara@brand.com',
      industry: 'Fashion',
    },
  ],
  talents: [
    {
      id: 'talent-1',
      name: 'Aman Verma',
      skills: ['Photography', 'Candid', 'Travel'],
      city: 'Goa',
    },
  ],
  gigs: [
    {
      id: 'gig-1',
      title: 'Goa Beach Shoot',
      clientId: 'client-1',
      talentId: 'talent-1',
      status: 'Ongoing',
      updates: [
        {
          note: 'Shoot scheduled for Nov 18-20',
          type: 'text',
          created_by: 'Ruchi',
          timestamp: '2025-07-14',
        },
      ],
    },
  ],
  notes: [
    {
      id: 'note-1',
      profileType: 'gig',
      profileId: 'gig-1',
      note: 'Kickoff call done',
      type: 'meeting',
      created_by: 'Ruchi',
      timestamp: '2025-07-10',
    },
  ],
};

function logData() {
  console.log('--- UPDATED DATA ---');
  console.log(JSON.stringify(data, null, 2));
}

module.exports = data;
module.exports.logData = logData; 