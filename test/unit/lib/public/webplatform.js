
describe("factory", function () {
        
    var fs = require('fs'),
        libPath = __dirname + "/../../../../lib/",
        webplatform = fs.readFileSync(libPath + "public/webplatform.js", "utf-8").toString(),
        _r = require;

    beforeEach(function () {
        require = function (id) {
            return _r(libPath + id);
        };
        GLOBAL.qnx = {callExtensionMethod : jasmine.createSpy().andReturn(42)};
        eval(webplatform);

    });

    it("has a create function", function () {
        expect(qnx.webplatform.createWebView()).toBeDefined();
    });

    it("can create a webview instance", function () {
        var webview = qnx.webplatform.createWebView();
        expect(webview).toBeDefined();
        //Need a way to spy on new WebView call
        expect(qnx.callExtensionMethod).toHaveBeenCalledWith("webview.create", webview.windowGroup, "InProcess");
    });

    it("can create a webview instance with a creation callback", function () {
        var events = require("events"),
            callback = function () {},
            webview;
        spyOn(events, "on");
        webview = qnx.webplatform.createWebView(callback);
        expect(webview).toBeDefined();
        //Need a way to spy on new WebView call
        expect(qnx.callExtensionMethod).toHaveBeenCalledWith("webview.create", webview.windowGroup, "InProcess");
        expect(events.on).toHaveBeenCalledWith(webview.id, "Created", callback);
    });

    it("can get a webview instance for the controller", function () {
        var chrome = require("chrome"),
            webview = qnx.webplatform.getController();
        expect(webview).toBeDefined();
        expect(webview.id).toEqual(chrome.id);
    });

    it("returns a singleton of the ApplicationWindow", function () {
        var appWindow = qnx.webplatform.getApplicationWindow();
        expect(appWindow).toBeDefined();
        expect(qnx.webplatform.getApplicationWindow()).toEqual(appWindow);
    });
});
