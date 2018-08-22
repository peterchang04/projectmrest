var expect = require('chai').expect;
var chai = require('chai');
var date = require('./date');

describe('testing date.add()', function() {
  const startDate = new Date('2010-01-01 12:00:00 UTC');
  it(`adding 45 to 1/1/10 12pm should eq 1/1/10 12:45pm`, () => {
    const dateAdded = date.add(startDate, 45);
    expect(dateAdded.toISOString()).to.equal('2010-01-01T12:45:00.000Z');
  });

  it(`adding -60 to 1/1/10 12pm should eq 1/1/10 11am`, () => {
    const dateAdded = date.add(startDate, -60);
    expect(dateAdded.toISOString()).to.equal('2010-01-01T11:00:00.000Z');
  });
});

describe('testing date.diff(d1, d2);', function() {
  const startDate = new Date('2010-01-01 12:00:00 UTC');
  const d2 = new Date('2010-01-01 12:45:00 UTC');
  it(`date.diff(12pm, 12:45pm) should eq 45`, () => {
    expect(date.diff(startDate, d2)).to.equal(45);
  });

  it(`date.diff(12:45pm, 12pm) should eq -45`, () => {
    expect(date.diff(d2, startDate)).to.equal(-45);
  });
});

describe('testing date.fromISO(isoString);', function() {
  it(`interprets 2018-08-21T21:42:49.956Z`, () => {
    var dateObj = date.fromISO('2018-08-21T21:42:49.956Z');
    expect(dateObj.toISOString()).to.equal('2018-08-21T21:42:49.956Z');
  });

  it(`interprets 2018-08-21T21:42:49`, () => {
    var dateObj = date.fromISO('2018-08-21T21:42:49');
    expect(dateObj.toISOString()).to.equal('2018-08-21T21:42:49.000Z');
  });
});
