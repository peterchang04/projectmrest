var expect = require('chai').expect;
var chai = require('chai');
var types = require('./param').types;

describe('param.types: string', function() {
  it('should fail on {}', () => {
    const value = types.string.implicitTransform({});
    expect(JSON.stringify(value)).to.equal(JSON.stringify({}));
    expect(types.string.isType(value)).to.equal(false);
  });
  it('should pass on "hello"', () => {
    const value = types.string.implicitTransform("hello");
    expect(value).to.equal("hello");
    expect(types.string.isType(value)).to.equal(true);
  });
  it('should cast number into string', () => {
    const value = types.string.implicitTransform(5);
    expect(value).to.equal("5");
    expect(types.string.isType(value)).to.equal(true);
  });
  it('should consider "" to be empty', () => {
    expect(types.string.isEmpty("")).to.equal(true);
  });
  it('should consider "asdf" to be NOT empty', () => {
    expect(types.string.isEmpty("asdf")).to.equal(false);
  });
});

describe('param.types: Date', function() {
  it('should fail on {}', () => {
    const value = types.Date.implicitTransform({});
    expect(JSON.stringify(value)).to.equal(JSON.stringify({}));
    expect(types.Date.isType(value)).to.equal(false);
  });
  it('should fail on "hello"', () => {
    const value = types.Date.implicitTransform("hello");
    expect(value).to.equal("hello");
    expect(types.Date.isType(value)).to.equal(false);
  });
  it('should fail on invalid date', () => {
    const value = types.Date.implicitTransform('512342515123245Z');
    expect(types.Date.isType(value)).to.equal(false);
  });
  it('should pass on valid date', () => {
    const value = types.Date.implicitTransform('20180101T235959Z');
    expect(types.Date.isType(value)).to.equal(true);
  });
});

describe('param.types: boolean', function() {
  it('should fail on {}', () => {
    const value = types.boolean.implicitTransform({});
    expect(JSON.stringify(value)).to.equal(JSON.stringify({}));
    expect(types.boolean.isType(value)).to.equal(false);
  });
  it('should fail on "hello"', () => {
    const value = types.boolean.implicitTransform('hello');
    expect(value).to.equal("hello");
    expect(types.boolean.isType(value)).to.equal(false);
  });
  it('should fail on -5', () => {
    const value = types.boolean.implicitTransform(-5);
    expect(value).to.equal(-5);
    expect(types.boolean.isType(value)).to.equal(false);
  });
  it('should pass on true', () => {
    const value = types.boolean.implicitTransform(true);
    expect(value).to.equal(true);
    expect(types.boolean.isType(value)).to.equal(true);
  });
  it('should pass on 1', () => {
    const value = types.boolean.implicitTransform(1);
    expect(types.boolean.isType(value)).to.equal(true);
  });
  it('should pass on 0', () => {
    const value = types.boolean.implicitTransform(0);
    expect(value).to.equal(false);
    expect(types.boolean.isType(value)).to.equal(true);
  });
  it('should pass on "true"', () => {
    const value = types.boolean.implicitTransform('true');
    expect(value).to.equal(true);
    expect(types.boolean.isType(value)).to.equal(true);
  });
  it('should pass on "false"', () => {
    const value = types.boolean.implicitTransform('false');
    expect(value).to.equal(false);
    expect(types.boolean.isType(value)).to.equal(true);
  });
  it('should pass on "1"', () => {
    const value = types.boolean.implicitTransform('1');
    expect(value).to.equal(true);
    expect(types.boolean.isType(value)).to.equal(true);
  });
  it('should pass on "0"', () => {
    const value = types.boolean.implicitTransform('0');
    expect(value).to.equal(false);
    expect(types.boolean.isType(value)).to.equal(true);
  });
});

describe('param.types: object', function() {
  it('should pass on {}', () => {
    const value = types.object.implicitTransform({});
    expect(JSON.stringify(value)).to.equal(JSON.stringify({}));
    expect(types.object.isType(value)).to.equal(true);
  });
  it('should fail on "hello"', () => {
    const value = types.object.implicitTransform("hello");
    expect(value).to.equal("hello");
    expect(types.object.isType(value)).to.equal(false);
  });
  it('should fail on []', () => {
    const value = types.object.implicitTransform([]);
    expect(JSON.stringify(value)).to.equal(JSON.stringify([]));
    expect(types.object.isType(value)).to.equal(false);
  });
  it('should consider {} to be empty', () => {
    expect(types.object.isEmpty({})).to.equal(true);
  });
  it('should consider { hi: 1 } to be NOT empty', () => {
    expect(types.object.isEmpty({ hi: 1 })).to.equal(false);
  });
});

describe('param.types: Array', function() {
  it('should fail on {}', () => {
    const value = types.Array.implicitTransform({});
    expect(JSON.stringify(value)).to.equal(JSON.stringify({}));
    expect(types.Array.isType(value)).to.equal(false);
  });
  it('should fail on "hello"', () => {
    const value = types.Array.implicitTransform("hello");
    expect(value).to.equal("hello");
    expect(types.Array.isType(value)).to.equal(false);
  });
  it('should pass on []', () => {
    const value = types.Array.implicitTransform([]);
    expect(JSON.stringify(value)).to.equal(JSON.stringify([]));
    expect(types.Array.isType(value)).to.equal(true);
  });
  it('should consider [] to be empty', () => {
    expect(types.Array.isEmpty([])).to.equal(true);
  });
  it('should consider [1] to be NOT empty', () => {
    expect(types.Array.isEmpty([1])).to.equal(false);
  });
});
