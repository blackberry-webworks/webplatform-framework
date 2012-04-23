
describe("factory", function () {
        
    var fs = require('fs'),
        jsdom = require('jsdom').jsdom,
        clientFilesPath = __dirname + "/../../../clientFiles/",
        webplatform = fs.readFileSync(clientFilesPath + "webplatform.js", "utf-8").toString(),
        mockBrowser = "(function () {" + 
        "window.qnx = {callExtensionMethod:function () {return 42;}};" + 
        "window.chrome = {internal:{webEvent:function () {}}};" + 
        "}());",
        markup = "<html><head><script>" + mockBrowser + webplatform + "</script></head><body></body></html>",
        doc,
        window;

    beforeEach(function () {
        doc = jsdom(markup);
        window = doc.createWindow();
        //window.qnx.callExtensionMethod = jasmine.createSpy();
        GLOBAL.window = window;
    });

    it("has a create function", function () {
        expect(window.qnx.webplatform.createWebView()).toBeDefined();
    });

    it("can create a webview instance", function () {
        var webview = window.qnx.webplatform.createWebView();
        expect(webview).toBeDefined();
    });

    it("can get a webview instance for the controller", function () {
        var chrome = require(clientFilesPath + "../lib/chrome"),
            webview = window.qnx.webplatform.getController();
        expect(webview).toBeDefined();
        expect(webview.id).toEqual(chrome.id);
    });

    it("returns a singleton of the ApplicationWindow", function () {
        var appWindow = window.qnx.webplatform.getApplicationWindow();
        expect(appWindow).toBeDefined();
        expect(window.qnx.webplatform.getApplicationWindow()).toEqual(appWindow);
    });
    
    it("can do some basic things", function () {
        var webview,
            callback = function (value, eventId) {
                webview.setGeometry(0, 0, 100, 100);
                webview.visible = true;
                webview.active = true;
            },
            jamesBond = jasmine.createSpy();
        jamesBond.andCallFake(callback);
        webview = window.qnx.webplatform.createWebView(jamesBond);
        window.chrome.internal.webEvent(webview.id, "Created", null);
        waits(1);
        runs(function () {
            expect(jamesBond).toHaveBeenCalled();
        });
    });

});
