
/**
 * Index controller for service worker
 */
class IndexController {
  constructor() {
    this._registerServiceWorker();
  }

  /**
   * Register a service worker
   */
  _registerServiceWorker() {
    if (!navigator.serviceWorker) return;

    var indexController = this;

    navigator.serviceWorker.register('sw.js').then(function(reg) {
      if (!navigator.serviceWorker.controller) {
        return;
      }

      if (reg.waiting) {
        indexController._updateReady(reg.waiting);
        return;
      }

      if (reg.installing) {
        indexController._trackInstalling(reg.installing);
        return;
      }

      reg.addEventListener('updatefound', function() {
        indexController._trackInstalling(reg.installing);
      });
    });

    // Ensure refresh is only called once.
    // This works around a bug in "force update on reload".
    var refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', function() {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
  }

  /**
   * Track the installing state of the service worker.
   * @param {ServiceWorker} worker
   */
  _trackInstalling(worker) {
    var indexController = this;
    worker.addEventListener('statechange', function() {
      if (worker.state == 'installed') {
        indexController._updateReady(worker);
      }
    });
  }

  /**
   * Notify the service worker to skip waiting.
   * @param {ServiceWorker} worker
   */
  _updateReady(worker) {
    worker.postMessage({action: 'skipWaiting'});
  }

}

new IndexController();
