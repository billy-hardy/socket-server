class TransientService {
    constructor() {
        this.objectStore = new Map();
    }

    generateUUID() {
        function r4() {
            function r() {
                return Math.floor(Math.random()*10)+'';
            }
            return r()+r()+r()+r();
        }
        return r4()+r4()+r4()+r4();
    }

    write(...data) {
        return Promise.all(data.map(data => {
            data.id = this.generateUUID();
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
