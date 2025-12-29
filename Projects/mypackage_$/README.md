<p align="center">
  <img src="./logo.svg" alt="dollarjs-util" width="120" />
</p>

<h1 align="center">dollarjs-util</h1>

<p align="center">
  Simplify API calls and array manipulation in JavaScript.<br/>
  Replace <code>.map()</code>, <code>.filter()</code>, <code>.find()</code>, <code>.reduce()</code> with clean <code>$</code> syntax.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/dollarjs-util"><img src="https://img.shields.io/npm/v/dollarjs-util.svg" alt="npm version" /></a>
  <a href="https://github.com/adarsh-priydarshi/dollarjs-util/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/dollarjs-util.svg" alt="license" /></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/node/v/dollarjs-util.svg" alt="node" /></a>
</p>

---

## 📦 Installation

```bash
npm install dollarjs-util
```

```javascript
const $ = require('dollarjs-util');
```

---

## Why dollarjs-util?

Write less code. Get more done.

| Task | Traditional Way | With dollarjs-util |
|------|-----------------|-------------------|
| Extract property | `users.map(u => u.name)` | `$(users).name` |
| Filter array | `users.filter(u => u.active === true)` | `$.filter(users, 'active', true)` |
| Find item | `users.find(u => u.id === 5)` | `$.find(users, 'id', 5)` |
| Sum values | `arr.reduce((s,x) => s + x.price, 0)` | `$.sum(arr, 'price')` |
| Group items | Complex reduce logic | `$.groupBy(arr, 'category')` |

---

## 🌐 API Calls

Make HTTP requests with minimal code. Returns parsed JSON directly.

### GET Request

```javascript
const $ = require('dollarjs-util');

const posts = await $('https://jsonplaceholder.typicode.com/posts');

// Input: URL string
// Output: Array of post objects
// [
//   { userId: 1, id: 1, title: '...', body: '...' },
//   { userId: 1, id: 2, title: '...', body: '...' },
//   ...
// ]
```

### POST Request

```javascript
const newPost = await $('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  data: {
    title: 'My Post',
    body: 'Post content here',
    userId: 1
  }
});

// Input: URL + options with method and data
// Output: Created object with id
// { id: 101, title: 'My Post', body: 'Post content here', userId: 1 }
```

### PUT Request

```javascript
const updated = await $('https://jsonplaceholder.typicode.com/posts/1', {
  method: 'PUT',
  data: {
    title: 'Updated Title',
    body: 'Updated content',
    userId: 1
  }
});

// Input: URL with ID + updated data
// Output: Updated object
// { id: 1, title: 'Updated Title', body: 'Updated content', userId: 1 }
```

### DELETE Request

```javascript
await $('https://jsonplaceholder.typicode.com/posts/1', {
  method: 'DELETE'
});

// Input: URL with ID + DELETE method
// Output: Empty object {}
```

### With Headers, Params & Timeout

```javascript
const data = await $('https://api.example.com/search', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your-token-here',
    'Content-Type': 'application/json'
  },
  params: {
    q: 'javascript',
    limit: 10,
    page: 1
  },
  timeout: 5000  // 5 seconds
});

// URL becomes: https://api.example.com/search?q=javascript&limit=10&page=1
// Headers are sent with request
// Request fails if no response in 5 seconds
```

### Error Handling

```javascript
try {
  const data = await $('https://api.example.com/not-found');
} catch (error) {
  console.log(error.message);  // "Request failed with status code 404"
  console.log(error.status);   // 404
  console.log(error.data);     // Response body if available
  console.log(error.code);     // Error code like 'ECONNREFUSED'
}
```

---

## ✨ Magic Property Access

Extract any property from an array of objects without writing `.map()`.

### Basic Usage

```javascript
const users = [
  { name: 'John', age: 25, city: 'NYC' },
  { name: 'Jane', age: 30, city: 'LA' },
  { name: 'Bob', age: 35, city: 'Chicago' }
];

// Traditional way
const names = users.map(user => user.name);

// With dollarjs-util
const names = $(users).name;

// Input: Array of objects
// Output: ['John', 'Jane', 'Bob']
```

### Multiple Properties

```javascript
const users = [
  { name: 'John', age: 25, email: 'john@test.com' },
  { name: 'Jane', age: 30, email: 'jane@test.com' }
];

const names = $(users).name;    // ['John', 'Jane']
const ages = $(users).age;      // [25, 30]
const emails = $(users).email;  // ['john@test.com', 'jane@test.com']
```

### Nested Properties

```javascript
const data = [
  { user: { profile: { name: 'John', avatar: 'john.jpg' } } },
  { user: { profile: { name: 'Jane', avatar: 'jane.jpg' } } }
];

// Step by step extraction
const users = $(data).user;
// Output: [{ profile: { name: 'John', ... } }, { profile: { name: 'Jane', ... } }]

const profiles = $(users).profile;
// Output: [{ name: 'John', avatar: 'john.jpg' }, { name: 'Jane', avatar: 'jane.jpg' }]

const names = $(profiles).name;
// Output: ['John', 'Jane']

// Or chain them
const names = $($($(data).user).profile).name;
// Output: ['John', 'Jane']
```

### With Callback Function

```javascript
// Double each number
const numbers = [1, 2, 3, 4, 5];
const doubled = $(numbers, x => x * 2);
// Input: [1, 2, 3, 4, 5]
// Output: [2, 4, 6, 8, 10]

// Transform objects
const users = [
  { firstName: 'John', lastName: 'Doe' },
  { firstName: 'Jane', lastName: 'Smith' }
];
const fullNames = $(users, u => `${u.firstName} ${u.lastName}`);
// Output: ['John Doe', 'Jane Smith']
```

---

## 🔍 Filtering & Searching

### $.filter()

Filter array by property value or custom function.

```javascript
const users = [
  { name: 'John', active: true, role: 'admin', age: 25 },
  { name: 'Jane', active: false, role: 'user', age: 30 },
  { name: 'Bob', active: true, role: 'user', age: 35 },
  { name: 'Alice', active: true, role: 'admin', age: 28 }
];

// Filter by property value
const activeUsers = $.filter(users, 'active', true);
// Input: array, property name, value to match
// Output: [{ name: 'John', ... }, { name: 'Bob', ... }, { name: 'Alice', ... }]

const admins = $.filter(users, 'role', 'admin');
// Output: [{ name: 'John', ... }, { name: 'Alice', ... }]

// Filter with custom function
const over30 = $.filter(users, user => user.age >= 30);
// Output: [{ name: 'Jane', ... }, { name: 'Bob', ... }]

const activeAdmins = $.filter(users, u => u.active && u.role === 'admin');
// Output: [{ name: 'John', ... }, { name: 'Alice', ... }]
```

### $.find()

Find single item by property value or custom function.

```javascript
const products = [
  { id: 1, name: 'Laptop', price: 999, inStock: true },
  { id: 2, name: 'Phone', price: 699, inStock: false },
  { id: 3, name: 'Tablet', price: 499, inStock: true }
];

// Find by property value
const laptop = $.find(products, 'id', 1);
// Input: array, property name, value to match
// Output: { id: 1, name: 'Laptop', price: 999, inStock: true }

const phone = $.find(products, 'name', 'Phone');
// Output: { id: 2, name: 'Phone', price: 699, inStock: false }

// Find with custom function
const expensive = $.find(products, p => p.price > 900);
// Output: { id: 1, name: 'Laptop', price: 999, inStock: true }

const cheapInStock = $.find(products, p => p.price < 600 && p.inStock);
// Output: { id: 3, name: 'Tablet', price: 499, inStock: true }

// Returns undefined if not found
const notFound = $.find(products, 'id', 999);
// Output: undefined
```

### $.some() and $.every()

Check if any or all items match a condition.

```javascript
const users = [
  { name: 'John', verified: true, premium: false },
  { name: 'Jane', verified: false, premium: true },
  { name: 'Bob', verified: true, premium: true }
];

// $.some - returns true if ANY item matches
$.some(users, 'verified', true);   // Output: true (John and Bob are verified)
$.some(users, 'premium', true);    // Output: true (Jane and Bob are premium)
$.some(users, 'name', 'Alice');    // Output: false (no Alice)

// $.every - returns true if ALL items match
$.every(users, 'verified', true);  // Output: false (Jane is not verified)
$.every(users, 'premium', true);   // Output: false (John is not premium)

// With custom function
$.some(users, u => u.verified && u.premium);   // Output: true (Bob matches)
$.every(users, u => u.name.length >= 3);       // Output: true (all names >= 3 chars)
```

---

## 📤 Extraction Methods

### $.first() and $.last()

Get items from beginning or end of array.

```javascript
const items = ['a', 'b', 'c', 'd', 'e'];

// Get first item
$.first(items);
// Output: 'a'

// Get first n items
$.first(items, 3);
// Output: ['a', 'b', 'c']

// Get last item
$.last(items);
// Output: 'e'

// Get last n items
$.last(items, 2);
// Output: ['d', 'e']

// With objects
const users = [
  { name: 'John' },
  { name: 'Jane' },
  { name: 'Bob' }
];

$.first(users);      // Output: { name: 'John' }
$.last(users);       // Output: { name: 'Bob' }
$.first(users, 2);   // Output: [{ name: 'John' }, { name: 'Jane' }]
```

### $.pick() and $.omit()

Select or remove specific properties from objects.

```javascript
const users = [
  { id: 1, name: 'John', email: 'john@test.com', password: 'secret123', token: 'abc' },
  { id: 2, name: 'Jane', email: 'jane@test.com', password: 'secret456', token: 'def' }
];

// $.pick - keep only specified properties
const publicData = $.pick(users, ['name', 'email']);
// Input: array, array of property names to keep
// Output: [
//   { name: 'John', email: 'john@test.com' },
//   { name: 'Jane', email: 'jane@test.com' }
// ]

// $.omit - remove specified properties
const safeData = $.omit(users, ['password', 'token']);
// Input: array, array of property names to remove
// Output: [
//   { id: 1, name: 'John', email: 'john@test.com' },
//   { id: 2, name: 'Jane', email: 'jane@test.com' }
// ]
```

---

## 🔢 Math Operations

### $.sum() and $.avg()

Calculate sum and average of numbers.

```javascript
// Simple number array
const numbers = [10, 20, 30, 40, 50];

$.sum(numbers);
// Output: 150

$.avg(numbers);
// Output: 30

// With objects - sum/avg by property
const orders = [
  { item: 'Book', price: 20, quantity: 2 },
  { item: 'Pen', price: 5, quantity: 10 },
  { item: 'Notebook', price: 15, quantity: 3 }
];

$.sum(orders, 'price');
// Input: array, property name
// Output: 40 (20 + 5 + 15)

$.sum(orders, 'quantity');
// Output: 15 (2 + 10 + 3)

$.avg(orders, 'price');
// Output: 13.333... (40 / 3)

// Handles invalid values gracefully
const mixed = [{ val: 10 }, { val: 'invalid' }, { val: 20 }, { val: null }];
$.sum(mixed, 'val');
// Output: 30 (ignores non-numeric values)
```

### $.min() and $.max()

Find minimum and maximum values.

```javascript
// Simple number array
const scores = [85, 92, 78, 95, 88];

$.min(scores);  // Output: 78
$.max(scores);  // Output: 95

// With objects - returns the entire object
const products = [
  { name: 'Laptop', price: 999 },
  { name: 'Phone', price: 699 },
  { name: 'Tablet', price: 499 },
  { name: 'Watch', price: 299 }
];

$.min(products, 'price');
// Input: array, property name
// Output: { name: 'Watch', price: 299 }

$.max(products, 'price');
// Output: { name: 'Laptop', price: 999 }

// Useful for finding records
const students = [
  { name: 'Alice', score: 95 },
  { name: 'Bob', score: 87 },
  { name: 'Charlie', score: 92 }
];

const topStudent = $.max(students, 'score');
// Output: { name: 'Alice', score: 95 }

console.log(`Top scorer: ${topStudent.name} with ${topStudent.score} points`);
// Output: "Top scorer: Alice with 95 points"
```

### $.count()

Count items or count by condition.

```javascript
const users = [
  { name: 'John', active: true, role: 'admin' },
  { name: 'Jane', active: false, role: 'user' },
  { name: 'Bob', active: true, role: 'user' },
  { name: 'Alice', active: true, role: 'admin' }
];

// Count all items
$.count(users);
// Output: 4

// Count by property value
$.count(users, 'active', true);
// Input: array, property name, value to count
// Output: 3

$.count(users, 'active', false);
// Output: 1

$.count(users, 'role', 'admin');
// Output: 2

$.count(users, 'role', 'user');
// Output: 2
```

---

## 🔄 Transformation Methods

### $.unique()

Remove duplicate values.

```javascript
// Simple array
const numbers = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
$.unique(numbers);
// Output: [1, 2, 3, 4]

const tags = ['js', 'python', 'js', 'java', 'python'];
$.unique(tags);
// Output: ['js', 'python', 'java']

// With objects - unique by property (keeps first occurrence)
const users = [
  { id: 1, city: 'NYC', name: 'John' },
  { id: 2, city: 'LA', name: 'Jane' },
  { id: 3, city: 'NYC', name: 'Bob' },
  { id: 4, city: 'Chicago', name: 'Alice' },
  { id: 5, city: 'LA', name: 'Charlie' }
];

$.unique(users, 'city');
// Input: array, property name for uniqueness check
// Output: [
//   { id: 1, city: 'NYC', name: 'John' },
//   { id: 2, city: 'LA', name: 'Jane' },
//   { id: 4, city: 'Chicago', name: 'Alice' }
// ]
// Note: Bob (NYC) and Charlie (LA) removed as duplicates
```

### $.groupBy()

Group array items by property value.

```javascript
const employees = [
  { name: 'John', department: 'Engineering', salary: 80000 },
  { name: 'Jane', department: 'Marketing', salary: 70000 },
  { name: 'Bob', department: 'Engineering', salary: 90000 },
  { name: 'Alice', department: 'Marketing', salary: 75000 },
  { name: 'Charlie', department: 'Sales', salary: 65000 }
];

const byDepartment = $.groupBy(employees, 'department');
// Input: array, property name to group by
// Output: {
//   Engineering: [
//     { name: 'John', department: 'Engineering', salary: 80000 },
//     { name: 'Bob', department: 'Engineering', salary: 90000 }
//   ],
//   Marketing: [
//     { name: 'Jane', department: 'Marketing', salary: 70000 },
//     { name: 'Alice', department: 'Marketing', salary: 75000 }
//   ],
//   Sales: [
//     { name: 'Charlie', department: 'Sales', salary: 65000 }
//   ]
// }

// Access specific group
console.log(byDepartment['Engineering'].length);  // Output: 2

// Combine with other methods
const engineeringSalaries = $.sum(byDepartment['Engineering'], 'salary');
// Output: 170000
```

### $.sortBy()

Sort array by property value.

```javascript
const products = [
  { name: 'Laptop', price: 999, rating: 4.5 },
  { name: 'Phone', price: 699, rating: 4.8 },
  { name: 'Tablet', price: 499, rating: 4.2 },
  { name: 'Watch', price: 299, rating: 4.6 }
];

// Sort ascending (default)
const byPriceAsc = $.sortBy(products, 'price');
// Input: array, property name, order ('asc' or 'desc')
// Output: [Watch, Tablet, Phone, Laptop] (by price: 299, 499, 699, 999)

// Sort descending
const byPriceDesc = $.sortBy(products, 'price', 'desc');
// Output: [Laptop, Phone, Tablet, Watch] (by price: 999, 699, 499, 299)

// Sort by rating
const byRating = $.sortBy(products, 'rating', 'desc');
// Output: [Phone, Watch, Laptop, Tablet] (by rating: 4.8, 4.6, 4.5, 4.2)

// Sort strings alphabetically
const users = [
  { name: 'Charlie' },
  { name: 'Alice' },
  { name: 'Bob' }
];
const alphabetical = $.sortBy(users, 'name');
// Output: [Alice, Bob, Charlie]
```

### $.chunk()

Split array into smaller arrays of specified size.

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

$.chunk(numbers, 3);
// Input: array, chunk size
// Output: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]

$.chunk(numbers, 2);
// Output: [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]]

$.chunk(numbers, 5);
// Output: [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]]

// Useful for pagination
const allItems = [/* 100 items */];
const pages = $.chunk(allItems, 10);  // 10 pages of 10 items each
const page1 = pages[0];
const page2 = pages[1];
```

### $.flatten()

Flatten nested arrays.

```javascript
const nested = [[1, 2], [3, 4], [5, 6]];
$.flatten(nested);
// Output: [1, 2, 3, 4, 5, 6]

// With depth parameter
const deep = [[1, [2, [3, [4]]]]];

$.flatten(deep);        // depth = 1 (default)
// Output: [1, [2, [3, [4]]]]

$.flatten(deep, 2);
// Output: [1, 2, [3, [4]]]

$.flatten(deep, 3);
// Output: [1, 2, 3, [4]]

$.flatten(deep, Infinity);
// Output: [1, 2, 3, 4]
```

---

## 💡 Real World Examples

### Fetch and Display User Data

```javascript
const $ = require('dollarjs-util');

async function displayUsers() {
  // Fetch users from API
  const users = await $('https://jsonplaceholder.typicode.com/users');
  
  // Extract just the names
  const names = $(users).name;
  console.log('All users:', names);
  // Output: ['Leanne Graham', 'Ervin Howell', ...]
  
  // Get emails
  const emails = $(users).email;
  console.log('Emails:', emails);
  // Output: ['Sincere@april.biz', 'Shanna@melissa.tv', ...]
}
```

### E-commerce Dashboard

```javascript
const $ = require('dollarjs-util');

async function getDashboardStats() {
  const orders = await $('https://api.example.com/orders');
  
  return {
    totalOrders: $.count(orders),
    completedOrders: $.count(orders, 'status', 'completed'),
    pendingOrders: $.count(orders, 'status', 'pending'),
    totalRevenue: $.sum(orders, 'amount'),
    averageOrderValue: $.avg(orders, 'amount'),
    highestOrder: $.max(orders, 'amount'),
    lowestOrder: $.min(orders, 'amount'),
    ordersByStatus: $.groupBy(orders, 'status'),
    recentOrders: $.first($.sortBy(orders, 'date', 'desc'), 5)
  };
}

// Usage
const stats = await getDashboardStats();
console.log(`Total Revenue: $${stats.totalRevenue}`);
console.log(`Average Order: $${stats.averageOrderValue.toFixed(2)}`);
console.log(`Completed: ${stats.completedOrders}, Pending: ${stats.pendingOrders}`);
```

### Student Grade Analysis

```javascript
const students = [
  { name: 'Alice', grade: 'A', score: 95, subject: 'Math' },
  { name: 'Bob', grade: 'B', score: 85, subject: 'Math' },
  { name: 'Charlie', grade: 'A', score: 92, subject: 'Science' },
  { name: 'Diana', grade: 'C', score: 75, subject: 'Math' },
  { name: 'Eve', grade: 'A', score: 98, subject: 'Science' }
];

// Average score
const avgScore = $.avg(students, 'score');
console.log(`Class average: ${avgScore}`);
// Output: Class average: 89

// Top performer
const topStudent = $.max(students, 'score');
console.log(`Top scorer: ${topStudent.name} (${topStudent.score})`);
// Output: Top scorer: Eve (98)

// Students by grade
const byGrade = $.groupBy(students, 'grade');
console.log(`A grade students: ${$(byGrade['A']).name.join(', ')}`);
// Output: A grade students: Alice, Charlie, Eve

// Filter by subject
const mathStudents = $.filter(students, 'subject', 'Math');
const mathAvg = $.avg(mathStudents, 'score');
console.log(`Math average: ${mathAvg}`);
// Output: Math average: 85
```

### Data Cleanup Pipeline

```javascript
const rawData = [
  { id: 1, name: 'John', email: 'john@test.com', password: 'secret', city: 'NYC' },
  { id: 2, name: 'Jane', email: 'jane@test.com', password: 'hidden', city: 'LA' },
  { id: 3, name: 'Bob', email: 'bob@test.com', password: 'pass123', city: 'NYC' },
  { id: 4, name: 'Alice', email: 'alice@test.com', password: 'alice1', city: 'Chicago' }
];

// Remove sensitive data
const safeData = $.omit(rawData, ['password']);

// Get unique cities
const uniqueCities = $.unique(rawData, 'city');
console.log('Cities:', $(uniqueCities).city);
// Output: Cities: ['NYC', 'LA', 'Chicago']

// Sort by name
const sorted = $.sortBy(safeData, 'name');

// Pick only needed fields
const publicProfiles = $.pick(sorted, ['name', 'city']);
// Output: [
//   { name: 'Alice', city: 'Chicago' },
//   { name: 'Bob', city: 'NYC' },
//   { name: 'Jane', city: 'LA' },
//   { name: 'John', city: 'NYC' }
// ]
```

---

## 📋 API Reference

### Main Function

| Syntax | Description | Returns |
|--------|-------------|---------|
| `$(url)` | GET request | `Promise<data>` |
| `$(url, options)` | HTTP request with options | `Promise<data>` |
| `$(array)` | Magic property access | `Proxy` |
| `$(array, fn)` | Map with function | `Array` |

### HTTP Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `method` | `string` | `'GET'` | HTTP method (GET, POST, PUT, DELETE) |
| `data` | `any` | - | Request body |
| `headers` | `object` | `{}` | Request headers |
| `params` | `object` | - | URL query parameters |
| `timeout` | `number` | `30000` | Timeout in milliseconds |

### Static Methods

| Method | Description |
|--------|-------------|
| `$.filter(arr, key, value)` | Filter by property value |
| `$.filter(arr, fn)` | Filter with custom function |
| `$.find(arr, key, value)` | Find by property value |
| `$.find(arr, fn)` | Find with custom function |
| `$.some(arr, key, value)` | Check if any match |
| `$.every(arr, key, value)` | Check if all match |
| `$.first(arr, n?)` | Get first n items |
| `$.last(arr, n?)` | Get last n items |
| `$.pick(arr, keys)` | Keep only specified properties |
| `$.omit(arr, keys)` | Remove specified properties |
| `$.sum(arr, key?)` | Sum of values |
| `$.avg(arr, key?)` | Average of values |
| `$.min(arr, key?)` | Minimum value/object |
| `$.max(arr, key?)` | Maximum value/object |
| `$.count(arr, key?, value?)` | Count items |
| `$.unique(arr, key?)` | Remove duplicates |
| `$.groupBy(arr, key)` | Group by property |
| `$.sortBy(arr, key, order?)` | Sort by property |
| `$.chunk(arr, size)` | Split into chunks |
| `$.flatten(arr, depth?)` | Flatten nested arrays |

---

## 📄 License

MIT License © Newton School of Technology

Created by [Adarsh Priydarshi](https://github.com/adarsh-priydarshi)
