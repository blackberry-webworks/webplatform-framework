
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
        expect(window.qnx.webplatform.createWebview()).toBeDefined();
    });

    it("can create a webview instance", function () {
        var webview = window.qnx.webplatform.createWebview();
        expect(webview).toBeDefined();
    });

    it("can get a webview instance for the controller", function () {
        var chrome = require(clientFilesPath + "../lib/chrome"),
            webview = window.qnx.webplatform.getController();
        expect(webview).toBeDefined();
        expect(webview.id).toEqual(chrome.id);
    });
});
