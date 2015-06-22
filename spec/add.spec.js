var add = require('../lib/add.js');

describe('adding', function() {
  it('adds two numbers correctly', function() {
    expect(add(2, 2)).toBe(4);
  });
});
