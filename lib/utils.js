var _self;

_self = {
    inNode: function () {
        return !!require.resolve;
    },

    getQnxNamespace: function () {
        return _self.inNode() ? null : qnx;
    },

    getScreenNamespace: function () {
        return _self.inNode() ? null : screen;
    },

    copy: function (obj) {
        var i,
            newObj = (obj === null ? false : global.toString.call(obj) === "[object Array]") ? [] : {};

        if (typeof obj === 'number' ||
            typeof obj === 'string' ||
            typeof obj === 'boolean' ||
            obj === null ||
            obj === undefined) {
            return obj;
        }

        if (obj instanceof Date) {
            return new Date(obj);
        }

        if (obj instanceof RegExp) {
            return new RegExp(obj);
        }

        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (obj[i] && typeof obj[i] === "object") {
                    if (obj[i] instanceof Date) {
                        newObj[i] = obj[i];
                    }
                    else {
                        newObj[i] = _self.copy(obj[i]);
                    }
                }
                else {
                    newObj[i] = obj[i];
                }
            }
        }

        return newObj;
    }
};

module.exports = _self;
