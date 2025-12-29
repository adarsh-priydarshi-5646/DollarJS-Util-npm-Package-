const axios = require('axios');

// ═══════════════════════════════════════════════════════════════════════════════
// DOLLARJS-UTIL - Simple utility for API calls and data manipulation
// Author: Adarsh Priydarshi | License: MIT (Newton School of Technology)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Main $ function - handles API calls and array/object manipulation
 * @param {string|Array|Object} input - URL for API call, or data to process
 * @param {Object|Function} [options] - Request options or callback function
 * @returns {Promise|Proxy|Array|Object}
 */

function $(input, options = {}) {
  // INPUT VALIDATION
  if (input === null || input === undefined) {
    throw new TypeError('Input cannot be null or undefined');
  }

  // STRING INPUT → API CALL
  if (typeof input === 'string') {
    const url = input.trim();
    if (!url) {
      throw new TypeError('URL cannot be empty');
    }

    const config = {
      method: (options.method || 'GET').toUpperCase(),
      url: url,
      headers: options.headers || {},
      timeout: typeof options.timeout === 'number' ? options.timeout : 30000,
    };

    if (options.data !== undefined) {
      config.data = options.data;
    }

    if (options.params && typeof options.params === 'object') {
      config.params = options.params;
    }

    return axios(config)
      .then(response => response.data)
      .catch(err => {
        const error = new Error(err.response?.data?.message || err.message || 'Request failed');
        error.status = err.response?.status || null;
        error.data = err.response?.data || null;
        error.code = err.code || null;
        throw error;
      });
  }

  // ARRAY INPUT → MAGIC PROPERTY ACCESS OR MAP
  if (Array.isArray(input)) {
    if (typeof options === 'function') {
      return input.map(options);
    }

    return new Proxy(input, {
      get(target, prop) {
        if (prop in target || typeof prop === 'symbol') {
          return target[prop];
        }
        if (!isNaN(Number(prop))) {
          return target[Number(prop)];
        }
        return target.map(item => {
          if (item === null || item === undefined) return undefined;
          return item[prop];
        });
      }
    });
  }

  // OBJECT INPUT → RETURN AS-IS OR MAP ENTRIES
  if (typeof input === 'object') {
    if (typeof options === 'function') {
      return Object.entries(input).map(([key, value]) => options(value, key));
    }
    return input;
  }

  throw new TypeError(`Unsupported input type: ${typeof input}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function validateArray(arr, methodName) {
  if (!Array.isArray(arr)) {
    throw new TypeError(`$.${methodName}(): First argument must be an array`);
  }
}

function validateKeys(keys, methodName) {
  if (!Array.isArray(keys)) {
    throw new TypeError(`$.${methodName}(): Keys must be an array`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FILTERING & SEARCHING
// ═══════════════════════════════════════════════════════════════════════════════

$.filter = function(arr, keyOrFn, value) {
  validateArray(arr, 'filter');
  if (typeof keyOrFn === 'function') return arr.filter(keyOrFn);
  if (typeof keyOrFn !== 'string') {
    throw new TypeError('$.filter(): Second argument must be a string or function');
  }
  return arr.filter(item => item != null && item[keyOrFn] === value);
};

$.find = function(arr, keyOrFn, value) {
  validateArray(arr, 'find');
  if (typeof keyOrFn === 'function') return arr.find(keyOrFn);
  if (typeof keyOrFn !== 'string') {
    throw new TypeError('$.find(): Second argument must be a string or function');
  }
  return arr.find(item => item != null && item[keyOrFn] === value);
};

$.some = function(arr, keyOrFn, value) {
  validateArray(arr, 'some');
  if (typeof keyOrFn === 'function') return arr.some(keyOrFn);
  return arr.some(item => item != null && item[keyOrFn] === value);
};

$.every = function(arr, keyOrFn, value) {
  validateArray(arr, 'every');
  if (typeof keyOrFn === 'function') return arr.every(keyOrFn);
  return arr.every(item => item != null && item[keyOrFn] === value);
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXTRACTION
// ═══════════════════════════════════════════════════════════════════════════════

$.first = function(arr, n = 1) {
  validateArray(arr, 'first');
  if (typeof n !== 'number' || n < 1) n = 1;
  return n === 1 ? arr[0] : arr.slice(0, n);
};

$.last = function(arr, n = 1) {
  validateArray(arr, 'last');
  if (typeof n !== 'number' || n < 1) n = 1;
  return n === 1 ? arr[arr.length - 1] : arr.slice(-n);
};

$.pick = function(arr, keys) {
  validateArray(arr, 'pick');
  validateKeys(keys, 'pick');
  return arr.map(item => {
    if (item == null) return {};
    const picked = {};
    for (const key of keys) {
      if (key in item) picked[key] = item[key];
    }
    return picked;
  });
};

$.omit = function(arr, keys) {
  validateArray(arr, 'omit');
  validateKeys(keys, 'omit');
  const keySet = new Set(keys);
  return arr.map(item => {
    if (item == null) return {};
    const result = {};
    for (const key in item) {
      if (!keySet.has(key)) result[key] = item[key];
    }
    return result;
  });
};

// ═══════════════════════════════════════════════════════════════════════════════
// MATH OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

$.sum = function(arr, key) {
  validateArray(arr, 'sum');
  if (arr.length === 0) return 0;
  return arr.reduce((sum, item) => {
    const val = key ? (item != null ? item[key] : 0) : item;
    return sum + (Number(val) || 0);
  }, 0);
};

$.avg = function(arr, key) {
  validateArray(arr, 'avg');
  if (arr.length === 0) return 0;
  return $.sum(arr, key) / arr.length;
};

$.min = function(arr, key) {
  validateArray(arr, 'min');
  if (arr.length === 0) return undefined;
  if (key) {
    return arr.reduce((min, item) => {
      if (item == null) return min;
      if (min == null) return item;
      return item[key] < min[key] ? item : min;
    }, null);
  }
  return Math.min(...arr.filter(n => typeof n === 'number'));
};

$.max = function(arr, key) {
  validateArray(arr, 'max');
  if (arr.length === 0) return undefined;
  if (key) {
    return arr.reduce((max, item) => {
      if (item == null) return max;
      if (max == null) return item;
      return item[key] > max[key] ? item : max;
    }, null);
  }
  return Math.max(...arr.filter(n => typeof n === 'number'));
};

$.count = function(arr, key, value) {
  validateArray(arr, 'count');
  if (key === undefined) return arr.length;
  return arr.filter(item => item != null && item[key] === value).length;
};

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSFORMATION
// ═══════════════════════════════════════════════════════════════════════════════

$.unique = function(arr, key) {
  validateArray(arr, 'unique');
  if (key) {
    const seen = new Set();
    return arr.filter(item => {
      if (item == null) return false;
      const val = item[key];
      if (seen.has(val)) return false;
      seen.add(val);
      return true;
    });
  }
  return [...new Set(arr)];
};

$.groupBy = function(arr, key) {
  validateArray(arr, 'groupBy');
  if (key === undefined || key === null || typeof key !== 'string') {
    throw new TypeError('$.groupBy(): Key must be a string');
  }
  return arr.reduce((groups, item) => {
    const val = item != null ? item[key] : 'undefined';
    const groupKey = val === undefined ? 'undefined' : String(val);
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(item);
    return groups;
  }, {});
};

$.sortBy = function(arr, key, order = 'asc') {
  validateArray(arr, 'sortBy');
  if (typeof key !== 'string') {
    throw new TypeError('$.sortBy(): Key must be a string');
  }
  const dir = order === 'desc' ? -1 : 1;
  return [...arr].sort((a, b) => {
    const valA = a != null ? a[key] : undefined;
    const valB = b != null ? b[key] : undefined;
    if (valA < valB) return -1 * dir;
    if (valA > valB) return 1 * dir;
    return 0;
  });
};

$.chunk = function(arr, size) {
  validateArray(arr, 'chunk');
  if (typeof size !== 'number' || size < 1) {
    throw new TypeError('$.chunk(): Size must be a positive number');
  }
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

$.flatten = function(arr, depth = 1) {
  validateArray(arr, 'flatten');
  if (typeof depth !== 'number' || depth < 1) depth = 1;
  return arr.flat(depth);
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

module.exports = $;
