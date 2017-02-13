class UUIDUtils {
    static generateUUID() {
        function r4() {
            function r() {
                return Math.floor(Math.random()*10)+'';
            }
            return r()+r()+r()+r();
        }
        return r4()+r4()+r4()+r4();
    }
}

module.exports = UUIDUtils;
