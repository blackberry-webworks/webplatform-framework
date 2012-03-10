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

    it("can create a webview instance", function () {
        expect(blackberry.createWebview()).toBeDefined();
        //expect(Webview).toHaveBeenCalledWith();
    });

    it("stores created webviews for later retrieval", function () {
        var webview = blackberry.createWebview(),
            retrievedWebview = blackberry.getWebview(webview.id);
        expect(retrievedWebview).toBe(webview);
    });

    it("can get a webview instance for a given id", function () {
        var webview,
            desiredId = 42;
        webview = blackberry.getWebview(desiredId);
        expect(webview).toBeDefined();
        //expect(this.Webview).toHaveBeenCalledWith({webviewId : desiredId});
        expect(webview.id).toEqual(desiredId);
    });

    it("can get a webview instance for the controller", function () {
        var chrome = require(srcPath + "chrome"),
            webview = blackberry.getController();
        expect(webview).toBeDefined();
        expect(webview.id).toEqual(chrome.id);
    });
});
