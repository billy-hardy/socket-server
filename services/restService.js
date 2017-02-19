class RestService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    _constructRequest(url, method, body) {
        let config = {
            method: method,
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        };
        if(body) {
            config.body = body;
        }
        let request = new Request(url, config);
        return fetch(request).then(res => res.json());
    }

    write(...data) {
        return Promise.all(data.map(data => {
            return this._constructRequest(this.baseUrl, 'post', JSON.stringify(data));
        }));
    }

    update(...data) {
        return Promise.all(data.map(data => {
            return this._constructRequest(this.baseUrl, 'put', JSON.stringify(data));
        }));
    }

    getById(id) {
        return this._constructRequest(this.baseUrl+'/'+id, 'get');
    }

    getAll() {
        return this._constructRequest(this.baseUrl, 'get');
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

    delete(id) {
        return this._constructRequest(this.baseUrl+'/'+id, 'delete');
    }
}

module.exports = RestService;
