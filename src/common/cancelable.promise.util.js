import _ from 'lodash';

/**
 * Usage:
 *
 * Use CancelablePromiseUtil in page
 * Wrap promise with CancelablePromiseUtil.makeCancelable(promise, this);
 *
 * const getRatePromise = CancelablePromiseUtil.makeCancelable(CoinswitchHelper.getRate(...), this);
 * const sdRate = await getRatePromise.promise;
 *
 * Cancel all the promise about the page when componentWillUnmount
 *
 * componentWillUnmount() {
 *   CancelablePromiseUtil.cancel(this);
 * }
 */
const CancelablePromiseUtil = {
  promiseObjects: [],

  // Wrap promise, return the promise wrapper { tag, promise, cancel }
  makeCancelable(promise, tag) {
    let hasCanceled = false;

    const wrappedPromise = new Promise((resolve, reject) => {
      promise.then(
        (val) => {
          if (!hasCanceled) {
            resolve(val);
          }
          _.remove(this.promiseObjects, (promiseObject) => promiseObject.promise === wrappedPromise);
        },
        (error) => {
          if (hasCanceled) {
            reject(error);
          }
          _.remove(this.promiseObjects, (promiseObject) => promiseObject.promise === wrappedPromise);
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
    console.log(this.promiseObjects);
  },
};

export default CancelablePromiseUtil;
