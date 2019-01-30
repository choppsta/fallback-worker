# Fallback Worker

Will create a `SharedWorker` if available, otherwise it falls back to a dedicated `Worker`.
The interface is normalised to the `Worker` interface.

# ES6 Usage
```javascript
    // main js
    import {FallbackWorker} from 'fallback-worker';

    const worker = new FallbackWorker('worker.js');

    worker.postMessage('message');
    worker.on('message', event => console.log(event));
    worker.on('error', err => console.error(err));
    worker.terminate();

    // worker.js
    import {FallbackWorkerBase} from 'fallback-worker';

    class MyWorker extends FallbackWorkerBase {
        constructor() {
            super();
        }

        // can override these
        onmessage(event) {}
        onerror(event) {}
    }

    const worker = new MyWorker();

    worker.postMessage('message');
    worker.on('message', event => console.log(event));
    worker.on('error', err => console.error(err));
    worker.close();
```
