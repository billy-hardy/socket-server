let idb = require('idb');
var UUIDUtils = require('../utils/uuidUtils.js');

class IndexedDBService {
    constructor(store, dbPromise, keypath = 'id') {
        this.store = store;
        this.dbPromise = dbPromise;
        this.keypath = keypath;
    }

    write(...data) {
        return Promise.all(data.map((data) => {
            return this.dbPromise.then(db => {
                data.id = UUIDUtils.generateUUID();
                const tx = db.transaction(this.store, 'readwrite');
                tx.objectStore(this.store).put(data);
                return tx.complete.then(_ => data);
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

    getByAttr(props) {
        return this.getAll().then(objs => {
            return objs.filter(obj => {
                let ret = true;
                for(let attr in props) {
                    if(props.hasOwnProperty(attr)) {
                        ret = ret && obj[attr] === props[attr];
                    }
                }
                return ret;
            });
        });
    }
}

module.exports = IndexedDBService;
