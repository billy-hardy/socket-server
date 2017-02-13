var UUIDUtils = require('../utils/uuidUtils.js');

class TransientService {
    constructor() {
        this.objectStore = new Map();
    }

    write(...data) {
        return Promise.all(data.map(data => {
            console.log("Transient service saving: "+JSON.stringify(data));
            data.id = UUIDUtils.generateUUID();
            data.version = 1;
            this.objectStore.set(data.id, data);
            return data;
        }));
    }

    update(...data) {
        return Promise.all(data.map(data => {
            data.version = data.version+1;
            this.objectStore.set(data.id, data);
            return data;
        }));
    }

    clear() {
        return Promise.resolve(this.objectStore.clear());
    }

    getById(id) {
        return Promise.resolve(this.objectStore.get(id));
    }

    getAll() {
        return Promise.resolve(Array.from(this.objectStore.values()));
    }

    delete(id) {
        return Promise.resolve(this.objectStore.delete(id));
    }
}

module.exports = TransientService;
