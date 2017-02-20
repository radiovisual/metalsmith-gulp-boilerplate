const metalsmith = require('../metalsmith');
const rm = require('rimraf');

beforeEach(() => {
  return rm.sync('build');
});

test('metalsmith builds', (done) => {
  metalsmith.build(function(err, files) {
      expect(err).toBe(null);
      done();
  });
});

test('index.html', (done) => {
  metalsmith.build(function(err, files) {
    const file = files['index.html'];
    const expected = '<p>This is the content for your <b>Home</b> page.</p>';
    const actual = file.contents.toString('utf8');

    expect(err).toBe(null);
    expect(file).toBeTruthy();
    expect(actual.search(expected) > 0).toBe(true);
    done();
  });
});

test('helper: trim', (done) => {
  metalsmith.build(function(err, files) {
    const file = files['index.html'];
    const expected = '<p>This should be trimmed via the trim helper.</p>';
    const actual = file.contents.toString('utf8');

    expect(err).toBe(null);
    expect(file).toBeTruthy();
    expect(actual.search(expected) > 0).toBe(true);
    done();
  });
});

afterAll(() => {
  return rm.sync('build');
});
