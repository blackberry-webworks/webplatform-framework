var srcPath = __dirname + "/../../../lib/";
var webviewFactory,
    utils = require(srcPath + "utils"), 
    mockedQnx = { 
        callExtensionMethod: jasmine.createSpy().andReturn(999)
    },
    mockedScreen = {
        height: 600,
        width: 1024
    };

describe("webviewFactory", function () {

    beforeEach(function () {
        spyOn(utils, "getQnxNamespace").andReturn(mockedQnx);
        spyOn(utils, "getScreenNamespace").andReturn(mockedScreen);
        webviewFactory = require(srcPath + "webviewFactory");
    });

    it("can create a webview instance", function () {
        var webview = webviewFactory.create();   
        expect(webview.id).toEqual(jasmine.any(Number));
    });
    
    it("can create a webview instance that can call create", function () {
        var webview = webviewFactory.create(),
            callback = jasmine.createSpy();
        webview.prototype.create(callback);
        expect(callback).toHaveBeenCalled();
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.applicationWindowGroup", 1);
    });
    
    it("can create a webview instance that can be destroyed", function () {
        var webview = webviewFactory.create(),
            callback = jasmine.createSpy();
        webview.prototype.create(callback);
        webview.prototype.destroy();
        expect(callback).toHaveBeenCalled();
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.destroy", jasmine.any(Number));
    });
   
    it("can create a webview instance that can set a url", function () {
        var webview = webviewFactory.create(),
            url = "http://www.google.com",
            callback = function () {
                webview.prototype.setURL(url);
            };
        webview.prototype.create(callback);
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.loadURL", jasmine.any(Number), url);
    });

    it("can create a webview instance that can execute javascript", function () {
        var webview = webviewFactory.create(),
            jsExpression = "var a = 'awesome';",
            callback = function () {
                webview.prototype.executeJavascript(jsExpression);
            }; 
        webview.prototype.create(callback);
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.executeJavaScript", jasmine.any(Number), jsExpression, false);
    });

    it("can create a webview instance that can be sent to the foreground", function () {
        var webview = webviewFactory.create(),
            callback = function () {
                webview.prototype.foreground();
            }; 
        webview.prototype.create(callback);
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setVisible", jasmine.any(Number), true);
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setActive", jasmine.any(Number), true);   
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setZOrder", jasmine.any(Number), 0);   
    });

    it("can create a webview instance that can be sent to the background", function () {
        var webview = webviewFactory.create(),
            callback = function () {
                webview.prototype.background();
            }; 
        webview.prototype.create(callback);
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setVisible", jasmine.any(Number), false);
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setActive", jasmine.any(Number), false);   
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setZOrder", jasmine.any(Number), -99);   
    });

});
