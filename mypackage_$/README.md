# dollarjs-util

> Simple utility for API calls and data manipulation with magic property access

[![npm version](https://img.shields.io/npm/v/dollarjs-util.svg)](https://www.npmjs.com/package/dollarjs-util)

## Installation

```bash
npm install dollarjs-util
```

## Features

- Simple API calls with automatic JSON parsing
- Magic property access on arrays (no `.map()` needed)
- Works with arrays, objects, and API responses
- Supports all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Built-in error handling
- Zero configuration needed

## Usage

```javascript
const $ = require('dollarjs-util');
```

### API Calls

```javascript
// GET request (default)
const todo = await $('https://api.example.com/todos/1');
console.log(todo.title);

// POST request
const newPost = await $('https://api.example.com/posts', {
  method: 'POST',
  data: { title: 'Hello', body: 'World' }
});

// PUT request
const updated = await $('https://api.example.com/posts/1', {
  method: 'PUT',
  data: { title: 'Updated Title' }
});

// PATCH request
const patched = await $('https://api.example.com/posts/1', {
  method: 'PATCH',
  data: { title: 'Patched' }
});

// DELETE request
await $('https://api.example.com/posts/1', { method: 'DELETE' });

// With custom headers
const data = await $('https://api.example.com/secure', {
  headers: {
    'Authorization': 'Bearer token123',
    'Content-Type': 'application/json'
  }
});

// With query params
const results = await $('https://api.example.com/search', {
  params: { q: 'hello', limit: 10 }
});

// With timeout
const data = await $('https://api.example.com/slow', {
  timeout: 5000  // 5 seconds
});
```

### Magic Property Access

Extract properties from arrays without `.map()`:

```javascript
const users = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 },
  { name: 'Bob', age: 35 }
];

const t = $(users);
console.log(t.name);  // ['John', 'Jane', 'Bob']
console.log(t.age);   // [25, 30, 35]
```

### Nested Data

```javascript
const data = [
  { user: { profile: { name: 'John' } } },
  { user: { profile: { name: 'Jane' } } }
];

const users = $(data).user;
const profiles = $(users).profile;
const names = $(profiles).name;
console.log(names);  // ['John', 'Jane']
```

### With Callback

```javascript
// Array with callback
const doubled = $([1, 2, 3], x => x * 2);
console.log(doubled);  // [2, 4, 6]

// Object with callback
const result = $({ a: 1, b: 2 }, (value, key) => ({ key, value }));
console.log(result);  // [{ key: 'a', value: 1 }, { key: 'b', value: 2 }]
```

### Combined: API + Magic Property

```javascript
// Fetch todos and extract titles
const todos = await $('https://jsonplaceholder.typicode.com/todos?_limit=5');
const titles = $(todos).title;
console.log(titles);

// Fetch users and extract emails
const users = await $('https://jsonplaceholder.typicode.com/users');
const emails = $(users).email;
console.log(emails);
```

## API Reference

### `$(input, options)`

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `input` | `string \| Array \| Object` | URL for API call, or data to process |
| `options` | `Object \| Function` | Request options or callback function |

#### Options (for API calls)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `method` | `string` | `'GET'` | HTTP method |
| `data` | `any` | - | Request body |
| `headers` | `Object` | `{}` | Request headers |
| `params` | `Object` | - | Query parameters |
| `timeout` | `number` | `30000` | Request timeout (ms) |

#### Returns

| Input Type | Return Type |
|------------|-------------|
| URL string | `Promise<any>` - Response data |
| Array | `Proxy` - With magic property access |
| Array + callback | `Array` - Mapped result |
| Object | `Object` - Same object |
| Object + callback | `Array` - Mapped entries |

## Error Handling

```javascript
try {
  const data = await $('https://api.example.com/data');
} catch (error) {
  console.log(error.message);  // Error message
  console.log(error.status);   // HTTP status code
  console.log(error.data);     // Response data
}
```

## Examples

### Fetch and Process Users

```javascript
const $ = require('dollarjs-util');

async function getActiveUserEmails() {
  const users = await $('https://api.example.com/users');
  const activeUsers = $(users, u => u.active ? u : null).filter(Boolean);
  return $(activeUsers).email;
}
```

### Create Multiple Posts

```javascript
const $ = require('dollarjs-util');

async function createPosts(titles) {
  const results = [];
  for (const title of titles) {
    const post = await $('https://api.example.com/posts', {
      method: 'POST',
      data: { title }
    });
    results.push(post);
  }
  return results;
}
```
