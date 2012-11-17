/**
 * @author Cyrill @SchumacherFM
 * @date 11/5/12
 */

var obj = {
    _prop : 1,
    get prop() {
        return this._prop;
    },
    set prop(value) {
        this._prop = value;
    }
//    writable: false,
//    enumerable: true,
//    configurable: false
};

console.log(obj);

console.log(obj.prop);

obj.prop = 2;

console.log(obj.prop);
