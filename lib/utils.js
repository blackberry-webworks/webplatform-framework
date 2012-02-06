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
    }
};

module.exports = _self;
