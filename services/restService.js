class RestService {
    constructor(baseUrl, fetch) {
        this.baseUrl = baseUrl;
        this.fetch = fetch;
    }

    _constructRequest(url, method, body) {
        let config = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'webClientToken': this.webClientToken
            } 
        };
        if(body) {
            config.body = body;
        }
        return this.fetch(url, config).then(res => res.json());
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
        let queries = [];
        for(let attr in props) {
            if(props.hasOwnProperty(attr)) {
                queries.push(attr+'='+props[attr]);
            }
        }
        return this._constructRequest(this.baseUrl+'/?'+queries.join('&'), 'get');
    }

    delete(id) {
        return this._constructRequest(this.baseUrl+'/'+id, 'delete');
    }
}

module.exports = RestService;
