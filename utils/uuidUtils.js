class UUIDUtils {
  static generateUUID() {
    function r16() {
      function r4() {
        return (Math.random() * 0xFFFF << 0).toString(16);
      }
      return r4() + r4() + r4() + r4();
    }
    return r16() + r16() + r16() + r16();
  }
}

module.exports = UUIDUtils;
