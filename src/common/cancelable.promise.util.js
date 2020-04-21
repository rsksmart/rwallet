import _ from 'lodash';

/**
 * Usage:
 *
 * Use CancelablePromiseUtil in page
 * Wrap promise with CancelablePromiseUtil.run(promise, this);
 * const sdRate = await CancelablePromiseUtil.makeCancelable(CoinswitchHelper.getRate(...), this);
 *
 * Cancel all the promise about the page when componentWillUnmount
 *
 * componentWillUnmount() {
 *   CancelablePromiseUtil.cancel(this);
 * }
 */
const CancelablePromiseUtil = {
  promiseObjects: [],

  // Wrap promise, return the wraped object  { tag, promise, cancel }
  wrapPromise(promise, tag) {
    let hasCanceled = false;

    const wrappedPromise = new Promise((resolve, reject) => {
      promise.then(
        (val) => {
          if (!hasCanceled) {
            resolve(val);
          }
          _.remove(this.promiseObjects, { promise: wrappedPromise });
        },
        (error) => {
          if (!hasCanceled) {
            reject(error);
          }
          _.remove(this.promiseObjects, { promise: wrappedPromise });
        },
      );
    });

    const promiseObject = {
      tag,
      promise: wrappedPromise,
      cancel() {
        hasCanceled = true;
      },
    };

    this.promiseObjects.push(promiseObject);
    return promiseObject;
  },

  // cancel with tag
  cancel(tag) {
    _.each(this.promiseObjects, (promiseObject) => {
      if (promiseObject.tag === tag) {
        promiseObject.cancel();
      }
    });
    _.remove(this.promiseObjects, { tag });
  },

  async makeCancelable(promise, tag) {
    return this.wrapPromise(promise, tag).promise;
  },

};

export default CancelablePromiseUtil;
