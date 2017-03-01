var UUIDUtils = require('../utils/uuidUtils.js');

class TransientService {
  constructor() {
    this.objectStore = new Map();
  }

  write(...data) {
    return Promise.all(data.map(data => {
        data.id = UUIDUtils.generateUUID();
        data.version = 1;
        console.log('Transient service saving: ' + JSON.stringify(data));
        this.objectStore.set(data.id, data);
        return data;
      }));
  }

  update(...data) {
    return Promise.all(data.map(data => {
        data.version = data.version + 1;
        this.objectStore.set(data.id, data);
        console.log('Transient service saving: ' + JSON.stringify(data));
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

  getByAttr(props) {
    return this.getAll().then(objs => {
        return objs.filter(obj => {
            let ret = true;
            for (let attr in props) {
              if (props.hasOwnProperty(attr)) {
                ret = ret && obj[attr] === props[attr];
              }
            }
            return ret;
          });
      });
  }

  delete(id) {
    return Promise.resolve(this.objectStore.delete(id));
  }
}

module.exports = TransientService;
