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
        let request = new Request(this.baseUrl, config);
        return fetch(request).then(res => res.json());
    }

    write(...data) {
        return Promise.all(data.map(data => {
            return this._constructRequest(this.baseUrl, 'post', JSON.stringify(data));
        }));
    }

    update(...data) {
        return Promise.all(data.map(data => {
            return this._constructRequest(this.baseUrl+'/'+data.id, 'put', JSON.stringify(data));
        }));
    }

    getById(id) {
        return this._constructRequest(this.baseUrl+'/'+id, 'get');
    }

    getAll() {
        return this._constructRequest(this.baseUrl, 'get');
    }

    delete(id) {
        return this._constructRequest(this.baseUrl+'/'+id, 'delete');
    }
}

module.exports = RestService;
