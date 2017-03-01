class DelegateService {
  constructor(baseService) {
    this.service = baseService;
  }

  write(...data) {
    return this.service.write(...data);
  }

  update(...data) {
    return this.service.update(...data);
  }

  getById(id) {
    return this.service.getById(id);
  }

  getAll() {
    return this.service.getAll();
  }

  getByAttr(props) {
    return this.service.getByAttr(props);
  }

  delete(id) {
    return this.service.delete(id);
  }

  authenticate(username, password) {
    return this.service.authenticate(username, password);
  }
}

module.exports = DelegateService;
