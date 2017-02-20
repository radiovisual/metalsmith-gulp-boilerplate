const trim = require('../layouts/helpers/trim');

test('trim', () => {
  expect(trim('   ')).toBe('');
  expect(trim('  foo  ')).toBe('foo');
});
