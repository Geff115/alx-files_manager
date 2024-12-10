// Setting up the Redis client
import { createClient } from 'redis';

class RedisClient {
  // Initializing a client instance in the constructor
  constructor() {
    this.client = createClient();

    // Handling errors
    this.client.on('error', (err) => {
      console.error(err);
    });

    // Connecting to Redis on initialization
    this.client.connect().catch((err) => {
      console.error(err);
    });
  }

  isAlive() {
    if (!this.client.isOpen) {
      return false;
    }
    return true;
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async set(key, value, duration) {
    try {
      let finalValue = value;
      // Handling non-string values
      if (typeof finalValue !== 'string') {
        finalValue = String(finalValue);
      }
      // input validation
      if (typeof key !== 'string' || typeof duration !== 'number') {
        throw new Error(`Invalid arguments for setEx: key=${key}, value=${finalValue}, duration=${duration}`);
      }
      // Setting the key and the expiration
      await this.client.setEx(key, duration, finalValue);
      return true;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
      console.log(`Deleted key: ${key}`);
    } catch (err) {
      console.error(err);
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
