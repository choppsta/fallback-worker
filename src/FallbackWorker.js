import EventEmitter from 'eventemitter3';

class FallbackWorker extends EventEmitter {
    constructor(url, options) {
        super();

        if (typeof Worker === 'undefined') return console.error('Worker not supported');

        this.url = url;
        this.options = options; // can be name or object of properties
        if (typeof SharedWorker !== 'undefined') { // IE10+ ok, Safari + iOS NOT supported
            this.worker = new SharedWorker(this.url, this.options);
            this.worker.port.start();
            this.interface = this.worker.port;
        } else {
            this.worker = new Worker(this.url, this.options);
            this.interface = this.worker;
        }

        // emit events from the worker
        this.interface.addEventListener('message', event => this.emit('message', event));
        this.interface.addEventListener('messageerror', err => this.emit('messageerror', err)); // chrome 60
        this.interface.addEventListener('error', err => this.emit('error', err));
    }

    postMessage(message, transfer) {
        this.interface.postMessage(message, transfer);
    }

    terminate() {
        this.worker.port ? this.worker.port.close() : this.worker.terminate();
    }
}

export default FallbackWorker;
