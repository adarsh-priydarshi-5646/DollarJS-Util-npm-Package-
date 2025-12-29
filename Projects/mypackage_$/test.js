const $ = require('./index.js');

console.log('═══════════════════════════════════════════════════════════════');
console.log('  DOLLARJS-UTIL TEST SUITE');
console.log('═══════════════════════════════════════════════════════════════\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(actual, expected, message) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(`${message || 'Not equal'}: expected ${expectedStr}, got ${actualStr}`);
  }
}

// Test Data
const users = [
  { id: 1, name: 'John', age: 25, active: true, city: 'NYC' },
  { id: 2, name: 'Jane', age: 30, active: false, city: 'LA' },
  { id: 3, name: 'Bob', age: 35, active: true, city: 'NYC' },
  { id: 4, name: 'Alice', age: 28, active: true, city: 'Chicago' }
];

const numbers = [10, 20, 30, 40, 50];

// ═══════════════════════════════════════════════════════════════
// MAGIC PROPERTY ACCESS
// ═══════════════════════════════════════════════════════════════
console.log('─── Magic Property Access ───');

test('Extract names from array', () => {
  assertEqual($(users).name, ['John', 'Jane', 'Bob', 'Alice']);
});

test('Extract ages from array', () => {
  assertEqual($(users).age, [25, 30, 35, 28]);
});

test('Handle null/undefined in array', () => {
  const arr = [{ a: 1 }, null, { a: 3 }];
  assertEqual($(arr).a, [1, undefined, 3]);
});

test('Array with callback (map)', () => {
  assertEqual($([1, 2, 3], x => x * 2), [2, 4, 6]);
});

// ═══════════════════════════════════════════════════════════════
// FILTERING & SEARCHING
// ═══════════════════════════════════════════════════════════════
console.log('\n─── Filtering & Searching ───');

test('$.filter by property value', () => {
  const result = $.filter(users, 'active', true);
  assertEqual(result.length, 3);
});

test('$.filter with function', () => {
  const result = $.filter(users, u => u.age > 28);
  assertEqual(result.length, 2);
});

test('$.find by property value', () => {
  const result = $.find(users, 'id', 2);
  assertEqual(result.name, 'Jane');
});

test('$.find with function', () => {
  const result = $.find(users, u => u.name === 'Bob');
  assertEqual(result.id, 3);
});

test('$.some returns true when match exists', () => {
  assert($.some(users, 'active', true) === true);
});

test('$.some returns false when no match', () => {
  assert($.some(users, 'city', 'London') === false);
});

test('$.every returns false when not all match', () => {
  assert($.every(users, 'active', true) === false);
});

test('$.every returns true when all match', () => {
  const allActive = $.filter(users, 'active', true);
  assert($.every(allActive, 'active', true) === true);
});

// ═══════════════════════════════════════════════════════════════
// EXTRACTION
// ═══════════════════════════════════════════════════════════════
console.log('\n─── Extraction ───');

test('$.first returns first item', () => {
  assertEqual($.first(users).name, 'John');
});

test('$.first(n) returns first n items', () => {
  assertEqual($.first(users, 2).length, 2);
});

test('$.last returns last item', () => {
  assertEqual($.last(users).name, 'Alice');
});

test('$.last(n) returns last n items', () => {
  assertEqual($.last(users, 2).length, 2);
});

test('$.pick keeps only specified properties', () => {
  const result = $.pick(users, ['name', 'age']);
  assert(!('id' in result[0]));
  assert('name' in result[0]);
  assert('age' in result[0]);
});

test('$.omit removes specified properties', () => {
  const result = $.omit(users, ['id', 'active']);
  assert(!('id' in result[0]));
  assert(!('active' in result[0]));
  assert('name' in result[0]);
});

// ═══════════════════════════════════════════════════════════════
// MATH OPERATIONS
// ═══════════════════════════════════════════════════════════════
console.log('\n─── Math Operations ───');

test('$.sum of numbers', () => {
  assertEqual($.sum(numbers), 150);
});

test('$.sum by property', () => {
  assertEqual($.sum(users, 'age'), 118);
});

test('$.avg of numbers', () => {
  assertEqual($.avg(numbers), 30);
});

test('$.avg by property', () => {
  assertEqual($.avg(users, 'age'), 29.5);
});

test('$.min of numbers', () => {
  assertEqual($.min(numbers), 10);
});

test('$.max of numbers', () => {
  assertEqual($.max(numbers), 50);
});

test('$.min by property returns object', () => {
  assertEqual($.min(users, 'age').name, 'John');
});

test('$.max by property returns object', () => {
  assertEqual($.max(users, 'age').name, 'Bob');
});

test('$.count returns length', () => {
  assertEqual($.count(users), 4);
});

test('$.count by property value', () => {
  assertEqual($.count(users, 'active', true), 3);
});

// ═══════════════════════════════════════════════════════════════
// TRANSFORMATION
// ═══════════════════════════════════════════════════════════════
console.log('\n─── Transformation ───');

test('$.unique removes duplicates', () => {
  assertEqual($.unique([1, 2, 2, 3, 3, 3]), [1, 2, 3]);
});

test('$.unique by property', () => {
  const result = $.unique(users, 'city');
  assertEqual(result.length, 3);
});

test('$.groupBy groups correctly', () => {
  const result = $.groupBy(users, 'city');
  assertEqual(result['NYC'].length, 2);
  assertEqual(result['LA'].length, 1);
});

test('$.sortBy ascending', () => {
  const result = $.sortBy(users, 'age');
  assertEqual(result[0].name, 'John');
  assertEqual(result[3].name, 'Bob');
});

test('$.sortBy descending', () => {
  const result = $.sortBy(users, 'age', 'desc');
  assertEqual(result[0].name, 'Bob');
  assertEqual(result[3].name, 'John');
});

test('$.chunk splits array', () => {
  assertEqual($.chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
});

test('$.flatten flattens array', () => {
  assertEqual($.flatten([[1, 2], [3, 4]]), [1, 2, 3, 4]);
});

// ═══════════════════════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════════════════════
console.log('\n─── Error Handling ───');

test('Throws on null input', () => {
  let threw = false;
  try { $(null); } catch (e) { threw = true; }
  assert(threw, 'Should throw on null');
});

test('Throws on undefined input', () => {
  let threw = false;
  try { $(undefined); } catch (e) { threw = true; }
  assert(threw, 'Should throw on undefined');
});

test('$.filter throws on non-array', () => {
  let threw = false;
  try { $.filter('not array', 'key', 'value'); } catch (e) { threw = true; }
  assert(threw, 'Should throw on non-array');
});

test('$.chunk throws on invalid size', () => {
  let threw = false;
  try { $.chunk([1, 2, 3], 0); } catch (e) { threw = true; }
  assert(threw, 'Should throw on size < 1');
});

test('$.groupBy throws on non-string key', () => {
  let threw = false;
  try { $.groupBy(users, 123); } catch (e) { threw = true; }
  assert(threw, 'Should throw on non-string key');
});

// ═══════════════════════════════════════════════════════════════
// EDGE CASES
// ═══════════════════════════════════════════════════════════════
console.log('\n─── Edge Cases ───');

test('Empty array handling', () => {
  assertEqual($.sum([]), 0);
  assertEqual($.avg([]), 0);
  assertEqual($.unique([]), []);
  assertEqual($.first([]), undefined);
});

test('$.filter with null items in array', () => {
  const arr = [{ a: 1 }, null, { a: 1 }];
  assertEqual($.filter(arr, 'a', 1).length, 2);
});

test('$.sum handles non-numeric values', () => {
  const arr = [{ val: 10 }, { val: 'invalid' }, { val: 20 }];
  assertEqual($.sum(arr, 'val'), 30);
});

// ═══════════════════════════════════════════════════════════════
// API CALL TEST
// ═══════════════════════════════════════════════════════════════
console.log('\n─── API Call ───');

(async () => {
  try {
    const post = await $('https://jsonplaceholder.typicode.com/posts/1');
    if (post && post.id === 1) {
      console.log('✓ API GET request works');
      passed++;
    } else {
      console.log('✗ API GET request failed');
      failed++;
    }
  } catch (err) {
    console.log('✗ API GET request failed:', err.message);
    failed++;
  }

  // Final Results
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════════════════════════════');
  
  if (failed > 0) {
    process.exit(1);
  }
})();
