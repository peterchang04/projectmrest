var expect = require('chai').expect;
var chai = require('chai');
var identifier = require('./identifier');

describe('identifier.random(8, 10) run 300 times', function() {
  const results = [];
  const resultCount = { 8: 0, 9: 0, 10: 0 };
  // populate results
  for (var i = 0; i < 300; i++) {
    const result = identifier.random(8, 10);
    resultCount[result]++; // increment the count for that result
  }

  it(`should have resultCount of set, 8, 9, 10 (was ${Object.keys(resultCount).length})`, () => {
    Object.keys(resultCount).length === 3;
    expect(Object.keys(resultCount).length).to.equal(3);
  });

  it(`should have resultCount for 8 (was ${resultCount[8]})`, () => {
    expect(resultCount[8]).to.be.above(0);
  });

  it(`should have resultCount for 9 (was ${resultCount[9]})`, () => {
    expect(resultCount[9]).to.be.above(0);
  });

  it(`should have resultCount for 10 (was ${resultCount[10]})`, () => {
    expect(resultCount[10]).to.be.above(0);
  });
});

describe('identifier.generate() run 100 times', function() {
  const results = [];
  for (var i = 0; i < 100; i++) {
    results.push(identifier.generate());
  }

  it('should have string results', () => {
    for (var i = 0; i < results.length; i++) {
      expect(typeof results[i]).to.equal('string');
    }
  });

  it('should have string length > 6', () => {
    for (var i = 0; i < results.length; i++) {
      expect(results[i].length).to.be.above(6);
    }
  });

  it('should split into at least 2 pieces', () => {
    for (var i = 0; i < results.length; i++) {
      expect(results[i].split('-').length).to.be.above(1);
    }
  });

  it('should have hashes scrubbed out e.g. %count% %verb%', () => {
    for (var i = 0; i < results.length; i++) {
      // make sure the hashes have been replaced
      expect(results[i]).to.not.contain('%count%');
      expect(results[i]).to.not.contain('%verb%');
      expect(results[i]).to.not.contain('%noun%');
    }
  });
});
