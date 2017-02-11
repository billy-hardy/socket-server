let idb = require("idb");

class Service {
    constructor(store, dbPromise, keypath = "id") {
        this.store = store;
        this.dbPromise = dbPromise;
        this.keypath = keypath;
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
        return Promise.all(data.map((data) => {
            return this.dbPromise.then(db => {
                const tx = db.transaction(this.store, 'readwrite');
                tx.objectStore(this.store).put(data);
                return tx.complete;
            });
        }));
    }

    update(...data) {
        return Promise.all(data.map((data) => {
            return this.dbPromise.then(db => {
                const tx = db.transaction(this.store, 'readwrite');
                tx.objectStore(this.store).put(data);
                return tx.complete;
            });
        }));
    }

    delete(id) {
        return this.dbPromise.then(db => {
            const tx = db.transaction(this.store, 'readwrite');
            tx.objectStore(this.store).delete(id);
            return tx.complete;
        });
    }

    clear() {
        return this.dbPromise.then(db => {
            const tx = db.transaction(this.store, 'readwrite');
            tx.objectStore(this.store).clear();
            return tx.complete;
        });
    }

    getById(id) {
        return this.dbPromise.then(db => {
            return db.transaction(this.store)
                .objectStore(this.store).get(id);
        });
    }

    getAll() {
        return this.dbPromise.then(db => {
            return db.transaction(this.store)
                .objectStore(this.store).getAll();
        });
    }
}

module.exports = Service;
