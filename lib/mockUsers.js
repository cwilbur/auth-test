var mockUsers = {

  cbabbage: {
    id: '2',
    username: 'cbabbage',
    displayName: 'Charles Babbage',
    profileUrl: 'https://en.wikipedia.org/wiki/Charles_Babbage',
    emails: ['charles@analyticalengine.ac.uk']
  },

  ada: {
    id: '3',
    username: 'ada',
    displayName: 'Augusta Ada King, Countess Lovelace',
    profileUrl: 'https://en.wikipedia.org/wiki/Ada_Lovelace',
    emails: ['root@analyticalengine.ac.uk']
  },

  bertr: {
    id: '5',
    username: 'bertr',
    displayName: 'Bertrand Russell',
    profileUrl: 'https://en.wikipedia.org/wiki/Bertrand_Russell',
    emails: ['bertrand@cam.ac.uk']
  },

  lambda: {
    id: '7',
    username: 'lambda',
    displayName: 'Alonzo Church',
    profileUrl: 'https://en.wikipedia.org/wiki/Alonzo_Church',
    emails: ['church@oxon.ac.uk']
  },

  alant: {
    id: '11',
    username: 'alant',
    displayName: 'Alan Turing',
    profileUrl: 'https://en.wikipedia.org/wiki/Alan_Turing',
    emails: ['alan.turing@princeton.edu']
  },

  nanosecond: {
    id: '13',
    username: 'nanosecond',
    displayName: 'Grace Hopper',
    profileUrl: 'https://en.wikipedia.org/wiki/Grace_Hopper',
    emails: ['grace.m.hopper@navy.mil']
  }
};

Object.keys(mockUsers).forEach(function(user) {
  user.provider = 'mock';
});

module.exports = mockUsers;
