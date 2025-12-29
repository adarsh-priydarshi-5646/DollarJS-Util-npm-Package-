<p align="center">
  <img src="https://raw.githubusercontent.com/adarsh-priydarshi-5646/DollarJS-Util-npm-Package-/v1.1.0/Projects/mypackage_%24/logo.svg" alt="dollarjs-util" width="80" />
</p>

<h1 align="center">dollarjs-util</h1>

<p align="center">
  Simplify API calls and array manipulation in JavaScript.<br/>
  Replace <code>.map()</code>, <code>.filter()</code>, <code>.find()</code>, <code>.reduce()</code> with clean <code>$</code> syntax.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/dollarjs-util"><img src="https://img.shields.io/npm/v/dollarjs-util.svg" alt="npm version" /></a>
  <a href="https://github.com/adarsh-priydarshi-5646/DollarJS-Util-npm-Package-/blob/v1.1.0/Projects/mypackage_%24/LICENSE"><img src="https://img.shields.io/npm/l/dollarjs-util.svg" alt="license" /></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/node/v/dollarjs-util.svg" alt="node" /></a>
</p>

---

## Installation

```bash
npm install dollarjs-util
```

```javascript
const $ = require('dollarjs-util');
```

---

## Why dollarjs-util?

| Task | Traditional Way | With dollarjs-util |
|------|-----------------|-------------------|
| Extract property | `users.map(u => u.name)` | `$(users).name` |
| Filter array | `users.filter(u => u.active === true)` | `$.filter(users, 'active', true)` |
| Find item | `users.find(u => u.id === 5)` | `$.find(users, 'id', 5)` |
| Sum values | `arr.reduce((s,x) => s + x.price, 0)` | `$.sum(arr, 'price')` |
| Group items | Complex reduce logic | `$.groupBy(arr, 'category')` |

---

## API Calls

### GET Request

```javascript
const posts = await $('https://jsonplaceholder.typicode.com/posts');
// Output: [{ userId: 1, id: 1, title: '...', body: '...' }, ...]
```

### POST Request

```javascript
const newPost = await $('https://api.example.com/posts', {
  method: 'POST',
  data: { title: 'My Post', body: 'Content here' }
});
// Output: { id: 101, title: 'My Post', body: 'Content here' }
```

### PUT Request

```javascript
const updated = await $('https://api.example.com/posts/1', {
  method: 'PUT',
  data: { title: 'Updated Title' }
});
```

### DELETE Request

```javascript
await $('https://api.example.com/posts/1', { method: 'DELETE' });
```

### With Headers & Params

```javascript
const data = await $('https://api.example.com/search', {
  headers: { 'Authorization': 'Bearer token123' },
  params: { q: 'javascript', limit: 10 },
  timeout: 5000
});
```

### Error Handling

```javascript
try {
  const data = await $('https://api.example.com/data');
} catch (error) {
  console.log(error.message);  // Error message
  console.log(error.status);   // HTTP status code
  console.log(error.data);     // Response body
}
```

---

## Magic Property Access

Extract properties from arrays without `.map()`:

```javascript
const users = [
  { name: 'John', age: 25, city: 'NYC' },
  { name: 'Jane', age: 30, city: 'LA' },
  { name: 'Bob', age: 35, city: 'Chicago' }
];

$(users).name;   // ['John', 'Jane', 'Bob']
$(users).age;    // [25, 30, 35]
$(users).city;   // ['NYC', 'LA', 'Chicago']
```

### With Callback

```javascript
const doubled = $([1, 2, 3], x => x * 2);
// Output: [2, 4, 6]
```

---

## Static Methods

### $.filter(array, key, value)

```javascript
const users = [
  { name: 'John', active: true },
  { name: 'Jane', active: false },
  { name: 'Bob', active: true }
];

$.filter(users, 'active', true);
// Output: [{ name: 'John', active: true }, { name: 'Bob', active: true }]

$.filter(users, u => u.name.length > 3);
// Output: [{ name: 'John', ... }, { name: 'Jane', ... }]
```

### $.find(array, key, value)

```javascript
const products = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Phone', price: 699 }
];

$.find(products, 'id', 1);
// Output: { id: 1, name: 'Laptop', price: 999 }

$.find(products, p => p.price > 900);
// Output: { id: 1, name: 'Laptop', price: 999 }
```

### $.some() and $.every()

```javascript
const users = [
  { name: 'John', verified: true },
  { name: 'Jane', verified: false }
];

$.some(users, 'verified', true);   // true
$.every(users, 'verified', true);  // false
```

### $.first() and $.last()

```javascript
const items = ['a', 'b', 'c', 'd', 'e'];

$.first(items);      // 'a'
$.first(items, 3);   // ['a', 'b', 'c']
$.last(items);       // 'e'
$.last(items, 2);    // ['d', 'e']
```

### $.pick() and $.omit()

```javascript
const users = [
  { id: 1, name: 'John', password: 'secret' }
];

$.pick(users, ['name']);
// Output: [{ name: 'John' }]

$.omit(users, ['password']);
// Output: [{ id: 1, name: 'John' }]
```

### $.sum() and $.avg()

```javascript
const orders = [
  { item: 'Book', price: 20 },
  { item: 'Pen', price: 5 },
  { item: 'Notebook', price: 15 }
];

$.sum(orders, 'price');   // 40
$.avg(orders, 'price');   // 13.33

$.sum([10, 20, 30]);      // 60
$.avg([10, 20, 30]);      // 20
```

### $.min() and $.max()

```javascript
$.min([5, 2, 8, 1]);   // 1
$.max([5, 2, 8, 1]);   // 8

const products = [
  { name: 'A', price: 100 },
  { name: 'B', price: 50 }
];

$.min(products, 'price');   // { name: 'B', price: 50 }
$.max(products, 'price');   // { name: 'A', price: 100 }
```

### $.count()

```javascript
const users = [
  { name: 'John', active: true },
  { name: 'Jane', active: false },
  { name: 'Bob', active: true }
];

$.count(users);                   // 3
$.count(users, 'active', true);   // 2
```

### $.unique()

```javascript
$.unique([1, 2, 2, 3, 3, 3]);   // [1, 2, 3]

const users = [
  { id: 1, city: 'NYC' },
  { id: 2, city: 'LA' },
  { id: 3, city: 'NYC' }
];

$.unique(users, 'city');
// Output: [{ id: 1, city: 'NYC' }, { id: 2, city: 'LA' }]
```

### $.groupBy()

```javascript
const employees = [
  { name: 'John', dept: 'Engineering' },
  { name: 'Jane', dept: 'Marketing' },
  { name: 'Bob', dept: 'Engineering' }
];

$.groupBy(employees, 'dept');
// Output: {
//   Engineering: [{ name: 'John', ... }, { name: 'Bob', ... }],
//   Marketing: [{ name: 'Jane', ... }]
// }
```

### $.sortBy()

```javascript
const products = [
  { name: 'Laptop', price: 999 },
  { name: 'Phone', price: 699 },
  { name: 'Tablet', price: 499 }
];

$.sortBy(products, 'price');
// Output: [Tablet, Phone, Laptop]

$.sortBy(products, 'price', 'desc');
// Output: [Laptop, Phone, Tablet]
```

### $.chunk()

```javascript
$.chunk([1, 2, 3, 4, 5], 2);
// Output: [[1, 2], [3, 4], [5]]
```

### $.flatten()

```javascript
$.flatten([[1, 2], [3, 4]]);
// Output: [1, 2, 3, 4]

$.flatten([[1, [2, [3]]]], 2);
// Output: [1, 2, 3]
```

---

## Real World Examples

### E-commerce Dashboard

```javascript
async function getDashboardStats() {
  const orders = await $('https://api.example.com/orders');
  
  return {
    totalOrders: $.count(orders),
    completedOrders: $.count(orders, 'status', 'completed'),
    totalRevenue: $.sum(orders, 'amount'),
    avgOrderValue: $.avg(orders, 'amount'),
    ordersByStatus: $.groupBy(orders, 'status')
  };
}
```

### Data Processing

```javascript
const users = await $('https://api.example.com/users');

const activeEmails = $($.filter(users, 'active', true)).email;
const byCity = $.groupBy(users, 'city');
const topUser = $.max(users, 'score');
const safeData = $.omit(users, ['password', 'token']);
```

---

## API Reference

### Main Function

| Syntax | Returns | Description |
|--------|---------|-------------|
| `$(url)` | `Promise` | GET request |
| `$(url, options)` | `Promise` | HTTP request with options |
| `$(array)` | `Proxy` | Magic property access |
| `$(array, fn)` | `Array` | Map with function |

### HTTP Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `method` | string | 'GET' | HTTP method |
| `data` | any | - | Request body |
| `headers` | object | {} | Request headers |
| `params` | object | - | Query parameters |
| `timeout` | number | 30000 | Timeout in ms |

### Static Methods

| Method | Description |
|--------|-------------|
| `$.filter(arr, key, value)` | Filter by property |
| `$.find(arr, key, value)` | Find single item |
| `$.some(arr, key, value)` | Check if any match |
| `$.every(arr, key, value)` | Check if all match |
| `$.first(arr, n?)` | Get first n items |
| `$.last(arr, n?)` | Get last n items |
| `$.pick(arr, keys)` | Keep specified properties |
| `$.omit(arr, keys)` | Remove specified properties |
| `$.sum(arr, key?)` | Sum values |
| `$.avg(arr, key?)` | Average values |
| `$.min(arr, key?)` | Get minimum |
| `$.max(arr, key?)` | Get maximum |
| `$.count(arr, key?, value?)` | Count items |
| `$.unique(arr, key?)` | Remove duplicates |
| `$.groupBy(arr, key)` | Group by property |
| `$.sortBy(arr, key, order?)` | Sort by property |
| `$.chunk(arr, size)` | Split into chunks |
| `$.flatten(arr, depth?)` | Flatten arrays |

---

## License

MIT License - Newton School of Technology

Created by [Adarsh Priydarshi](https://github.com/adarsh-priydarshi-5646)

[GitHub Repository](https://github.com/adarsh-priydarshi-5646/DollarJS-Util-npm-Package-
