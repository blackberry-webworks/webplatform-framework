var srcPath = __dirname + "/../../lib/";

describe("webviewFactory eventing", function () {

    var chrome = {internal : require(srcPath + "chrome/internal")},
        blackberry,
        utils = require(srcPath + "utils"), 
        mockedQnx = require(srcPath + "mockedObjects").mockedQnx;

    beforeEach(function () {
        spyOn(utils, "getQnxNamespace").andReturn(mockedQnx);
        blackberry = require(srcPath + "webviewFactory");
    });

    it("can create webviews that can listen to system events", function () {
        var webview = blackberry.createWebview(),
            callback = jasmine.createSpy(),
            value = "AwesomeSauceZorZ";
        
        webview.on('Created', callback);
        chrome.internal.webEvent(webview.id, 'Created', value);
        
        expect(callback).not.toHaveBeenCalled();
        waits(1);
        runs(function () {
            expect(callback).toHaveBeenCalledWith(value);
        });
    });

    it("can create webviews that can listen to system events once", function () {
        var webview = blackberry.createWebview(),
            callback = jasmine.createSpy(),
            value = "AwesomeSauceZorZ";
        
        webview.once('ContentRendered', callback);
        chrome.internal.webEvent(webview.id, 'ContentRendered', value);
        chrome.internal.webEvent(webview.id, 'ContentRendered', value);
        
        waits(1);
        runs(function () {
            expect(callback.callCount).toEqual(1);
        });

    });
});

