var srcPath = __dirname + "/../../lib/";

describe("webviewFactory eventing", function () {

    var chrome,
        blackberry,
        utils = require(srcPath + "utils"), 
        mockedQnx = require(srcPath + "../test/mockedObjects").mockedQnx;

    beforeEach(function () {
        spyOn(utils, "getQnxNamespace").andReturn(mockedQnx);
        blackberry = require(srcPath + "webview/factory");
        chrome = {internal : require(srcPath + "chrome/internal")};
    });

    it("can create webviews that can listen to system events", function () {
        var webview = blackberry.createWebview(),
            callback = jasmine.createSpy(),
            value = "AwesomeSauceZorZ";
        
        webview.addEventListener('Created', callback);
        chrome.internal.webEvent(webview.id, 'Created', value);
        
        expect(callback).wasNotCalled();
        waits(1);
        runs(function () {
            expect(callback).toHaveBeenCalledWith(value);
        });
    });

});

