class Timer {
  timeouts = new Map();

  executedTimeouts = new Set();

  contextTimers = new WeakMap();

  contextTimer(ctx) {
    if (!this.contextTimers.has(ctx)) {
      this.contextTimers.set(ctx, new Timer());
    }

    return this.contextTimers.get(ctx);
  }

  setTimeout(...args) {
    if ((typeof args[0]) === 'object') {
      return this.setTimeoutContext(...args);
    }
    return this.setTimeoutVanilla(...args);
  }

  setTimeoutContext(ctx, name, fn, interval) {
    this.contextTimer(ctx).setTimeout(name, fn, interval);
    return this;
  }

  setTimeoutVanilla(name, fn, interval) {
    this.clearTimeout(name);
    this.timeouts.set(name, setTimeout(() => {
      this.clearTimeout(name);
      this.executedTimeouts.add(name);
      fn();
      this.executedTimeouts.delete(name);
    }, interval));

    return this;
  }

  clearTimeout(...args) {
    if ((typeof args[0]) === 'object') {
      return this.clearTimeoutContext(...args);
    }
    return this.clearTimeoutVanilla(...args);
  }

  clearTimeoutContext(ctx, ...args) {
    if (!this.contextTimers.has(ctx)) {
      return this;
    }

    if (args.length === 0) {
      Array.from(this.contextTimer(ctx).timeouts.keys()).forEach((timeout) => {
        this.contextTimer(ctx).clearTimeout(timeout);
      });
    } else {
      const [timeout] = args;
      this.contextTimer(ctx).clearTimeout(timeout);
    }

    return this;
  }

  clearTimeoutVanilla(name) {
    if (this.timeouts.has(name)) {
      clearTimeout(this.timeouts.get(name));
      this.timeouts.delete(name);
    }

    return this;
  }

  timeoutExists(...args) {
    if ((typeof args[0]) === 'object') {
      return this.timeoutExistsContext(...args);
    }
    return this.timeoutExistsVanilla(...args);
  }

  timeoutExistsContext(ctx, name) {
    return this.contextTimers.has(ctx) && this.contextTimer(ctx).timeoutExists(name);
  }

  timeoutExistsVanilla(name) {
    return this.timeouts.has(name) || this.executedTimeouts.has(name);
  }
}

export default new Timer();
