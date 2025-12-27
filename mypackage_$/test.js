const $ = require('./index.js');

async function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (err) {
      console.log(`✗ ${name}: ${err.message}`);
      failed++;
    }
  }

  async function testAsync(name, fn) {
    try {
      await fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (err) {
      console.log(`✗ ${name}: ${err.message}`);
      failed++;
    }
  }

  function assert(condition, msg = 'Assertion failed') {
    if (!condition) throw new Error(msg);
  }

  console.log('=== API TESTS ===\n');

  await testAsync('GET request', async () => {
    const data = await $('https://jsonplaceholder.typicode.com/todos/1');
    assert(data.id === 1);
    assert(data.title !== undefined);
  });

  await testAsync('GET with array response', async () => {
    const data = await $('https://jsonplaceholder.typicode.com/todos?_limit=3');
    assert(Array.isArray(data));
    assert(data.length === 3);
  });

  await testAsync('POST request', async () => {
    const data = await $('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      data: { title: 'Test', body: 'Content' }
    });
    assert(data.id !== undefined);
  });

  await testAsync('PUT request', async () => {
    const data = await $('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'PUT',
      data: { title: 'Updated' }
    });
    assert(data.title === 'Updated');
  });

  await testAsync('PATCH request', async () => {
    const data = await $('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'PATCH',
      data: { title: 'Patched' }
    });
    assert(data.title === 'Patched');
  });

  await testAsync('DELETE request', async () => {
    const data = await $('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'DELETE'
    });
    assert(data !== undefined);
  });

  await testAsync('Custom headers', async () => {
    const data = await $('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Custom': 'test' },
      data: { title: 'With Headers' }
    });
    assert(data.id !== undefined);
  });

  console.log('\n=== ARRAY TESTS ===\n');

  test('Array magic property access', () => {
    const users = [{ name: 'John' }, { name: 'Jane' }];
    const t = $(users);
    assert(JSON.stringify(t.name) === '["John","Jane"]');
  });

  test('Array with callback', () => {
    const result = $([1, 2, 3], x => x * 2);
    assert(JSON.stringify(result) === '[2,4,6]');
  });

  test('Nested array property', () => {
    const data = [{ user: { name: 'A' } }, { user: { name: 'B' } }];
    const users = $(data).user;
    const names = $(users).name;
    assert(JSON.stringify(names) === '["A","B"]');
  });

  test('Array with null items', () => {
    const data = [{ name: 'John' }, null, { name: 'Jane' }];
    const names = $(data).name;
    assert(names[0] === 'John');
    assert(names[1] === undefined);
    assert(names[2] === 'Jane');
  });

  test('Empty array', () => {
    const result = $([]);
    assert(result.length === 0);
  });

  test('Array length preserved', () => {
    const arr = $([1, 2, 3, 4, 5]);
    assert(arr.length === 5);
  });

  test('Array methods work', () => {
    const arr = $([1, 2, 3]);
    assert(arr.includes(2));
    assert(arr.indexOf(2) === 1);
  });

  console.log('\n=== OBJECT TESTS ===\n');

  test('Object with callback', () => {
    const result = $({ a: 1, b: 2 }, (val, key) => ({ key, val }));
    assert(result.length === 2);
    assert(result[0].key === 'a');
  });

  test('Object returns as is', () => {
    const obj = { name: 'John', age: 25 };
    const result = $(obj);
    assert(result.name === 'John');
    assert(result.age === 25);
  });

  test('Nested object', () => {
    const obj = { user: { profile: { name: 'John' } } };
    const result = $(obj);
    assert(result.user.profile.name === 'John');
  });

  console.log('\n=== EDGE CASES ===\n');

  test('Null input throws error', () => {
    let threw = false;
    try { $(null); } catch (e) { threw = true; }
    assert(threw);
  });

  test('Undefined input throws error', () => {
    let threw = false;
    try { $(undefined); } catch (e) { threw = true; }
    assert(threw);
  });

  test('Empty URL throws error', () => {
    let threw = false;
    try { $(''); } catch (e) { threw = true; }
    assert(threw);
  });

  test('Number input throws error', () => {
    let threw = false;
    try { $(123); } catch (e) { threw = true; }
    assert(threw);
  });

  await testAsync('Invalid URL returns error', async () => {
    let threw = false;
    try {
      await $('https://invalid-url-that-does-not-exist-12345.com/api');
    } catch (e) {
      threw = true;
    }
    assert(threw);
  });

  console.log('\n=== COMBINED USAGE ===\n');

  await testAsync('API + magic property', async () => {
    const todos = await $('https://jsonplaceholder.typicode.com/todos?_limit=3');
    const titles = $(todos).title;
    assert(titles.length === 3);
    assert(typeof titles[0] === 'string');
  });

  await testAsync('API + callback', async () => {
    const todos = await $('https://jsonplaceholder.typicode.com/todos?_limit=3');
    const ids = $(todos, t => t.id * 2);
    assert(ids[0] === 2);
    assert(ids[1] === 4);
  });

  console.log(`\n=============================`);
  console.log(`PASSED: ${passed} | FAILED: ${failed}`);
  console.log(`=============================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
