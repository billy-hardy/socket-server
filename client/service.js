let idb = require("idb");

class Service {
    constructor(store, keypath = "id") {
        this.store = store
        this.keypath = keypath;
        this.dbPromise = idb.open('app', 1, upgradeDB => {
            upgradeDB.createObjectStore(this.store, {keyPath: this.keypath});
        });
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