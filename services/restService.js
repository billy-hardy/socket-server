class RestService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
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
        return {url, config};
    }

    sendRequest({url, config}) {
        return fetch(url, config).then(res => res.json());
    }

    write(...data) {
        return Promise.all(data.map(data => {
            let req = this._constructRequest(this.baseUrl, 'post', JSON.stringify(data));
            return this.sendRequest(req);
        }));
    }

    update(...data) {
        return Promise.all(data.map(data => {
            let req = this._constructRequest(this.baseUrl, 'put', JSON.stringify(data));
            return this.sendRequest(req);
        }));
    }

    getById(id) {
        let req = this._constructRequest(this.baseUrl+'/'+id, 'get');
        return this.sendRequest(req);
    }

    getAll() {
        let req = this._constructRequest(this.baseUrl, 'get');
        return this.sendRequest(req);
    }

    getByAttr(props) {
        let queries = [];
        for(let attr in props) {
            if(props.hasOwnProperty(attr)) {
                queries.push(attr+'='+props[attr]);
            }
        }
        let req = this._constructRequest(this.baseUrl+'/?'+queries.join('&'), 'get');
        return this.sendRequest(req);
    }

    delete(id) {
        let req = this._constructRequest(this.baseUrl+'/'+id, 'delete');
        return this.sendRequest(req);
    }
}

module.exports = RestService;
