import EventEmitter from 'eventemitter3';

class FallbackWorkerBase extends EventEmitter {
    constructor() {
        super();

        if (typeof DedicatedWorkerGlobalScope !== 'undefined') {
            self.addEventListener('message', this.onmessage.bind(this));
        } else if (typeof SharedWorkerGlobalScope !== 'undefined') {
            this.ports = [];
            self.addEventListener('connect', event => {
                const port = event.ports[0];
                port.addEventListener('message', this.onmessage.bind(this));
                port.start();
                this.ports.push(port);

                // any queued messages?
                if (this.queue && this.queue.length) {
                    this.queue.forEach(item => this.postMessage(...item));
                    delete this.queue;
                }
            });
        } else {
            return console.error('not in shared or dedicated worker context');
        }

        self.addEventListener('error', this.onerror.bind(this));
    }

    onmessage(event) {
        this.emit('message', event);
    }

    onerror(event) {
        this.emit('error', event);
    }

    postMessage(message, transfer) {
        if (!this.ports) return self.postMessage(message, transfer);

        // if not connected, queue the messages
        if (!this.ports.length) {
            if (!this.queue) this.queue = [];
            return this.queue.push([message, transfer]);
        }

        this.ports.forEach(port => port.postMessage(message, transfer));
    }

    close() {
        self.close();
    }
}

export default FallbackWorkerBase;
