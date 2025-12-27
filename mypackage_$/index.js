const axios = require('axios');

/**
 * $ - A utility function for API calls and data manipulation
 * @param {string|Array|Object} input - URL string, array, or object
 * @param {Object|Function} options - Request options or callback function
 * @returns {Promise|Proxy|Array} - Promise for API, Proxy for array, or mapped result
 */
function $(input, options = {}) {
  // Handle null/undefined
  if (input === null || input === undefined) {
    throw new Error('Input cannot be null or undefined');
  }

  // URL string - API call
  if (typeof input === 'string') {
    if (!input.trim()) {
      throw new Error('URL cannot be empty');
    }

    const config = {
      method: options.method || 'GET',
      url: input.trim(),
      headers: options.headers || {},
      timeout: options.timeout || 30000,
    };

    // Add data for POST, PUT, PATCH
    if (options.data !== undefined) {
      config.data = options.data;
    }

    // Add query params if provided
    if (options.params) {
      config.params = options.params;
    }

    return axios(config)
      .then(res => res.data)
      .catch(err => {
        const error = new Error(err.response?.data?.message || err.message);
        error.status = err.response?.status;
        error.data = err.response?.data;
        throw error;
      });
  }

  // Array handling
  if (Array.isArray(input)) {
    // If callback provided, map over array
    if (typeof options === 'function') {
      return input.map(options);
    }

    // Return Proxy for magic property access
    return new Proxy(input, {
      get(target, prop) {
        // Handle array methods and properties
        if (prop in target || typeof prop === 'symbol') {
          return target[prop];
        }

        // Handle numeric index
        if (!isNaN(prop)) {
          return target[prop];
        }

        // Magic: extract property from all items
        return target.map(item => {
          if (item === null || item === undefined) return undefined;
          return item[prop];
        });
      }
    });
  }

  // Object handling
  if (typeof input === 'object') {
    // If callback provided, map over entries
    if (typeof options === 'function') {
      return Object.entries(input).map(([key, value]) => options(value, key));
    }

    // Return object as is
    return input;
  }

  // Unsupported types
  throw new Error(`Unsupported input type: ${typeof input}`);
}

module.exports = $;
