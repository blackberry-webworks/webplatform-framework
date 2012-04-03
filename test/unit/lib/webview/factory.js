var srcPath = __dirname + "/../../../../lib/";

describe("factory", function () {
        
    var blackberry,
        Webview,
        mockedQnx = require(srcPath + "../test/mockedObjects").mockedQnx,
        utils = require(srcPath + "utils");

    beforeEach(function () {
        spyOn(utils, "getQnxNamespace").andReturn(mockedQnx);
        blackberry = require(srcPath + "webview/factory");
        Webview = require(srcPath + "webview/webview");
        //spyOn(that, "Webview").andCallThrough();
    });

    it("has a create function", function () {
        expect(blackberry.createWebview()).toBeDefined();
        //expect(Webview).toHaveBeenCalledWith();
    });

    it("can create a webview instance", function () {
        var webview = blackberry.createWebview();
        expect(webview).toBeDefined();
        //expect(this.Webview).toHaveBeenCalledWith({webviewId : desiredId});
        //expect(Webview).toHaveBeenCalledWith();
    });

    it("can get a webview instance for the controller", function () {
        var chrome = require(srcPath + "chrome"),
            webview = blackberry.getController();
        expect(webview).toBeDefined();
        expect(webview.id).toEqual(chrome.id);
    });
});
