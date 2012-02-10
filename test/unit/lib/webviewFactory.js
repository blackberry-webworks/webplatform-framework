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
        webviewFactory = require(srcPath + "webviewFactory");
    });

    it("can create a webview instance", function () {
        var webview = webviewFactory.create();   
        expect(webview.id).toEqual(jasmine.any(Number));
        expect(webview.visible).toEqual(false);
        expect(webview.active).toEqual(false);
        expect(webview.zOrder).toEqual(jasmine.any(Number));
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
                webview.prototype.executeJavaScript(jsExpression);
            }; 
        webview.prototype.create(callback);
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.executeJavaScript", jasmine.any(Number), jsExpression, false);
    });

    it("can create a webview instance that can have its visibility changed", function () {
        var webview = webviewFactory.create();
        webview.visible = true;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setVisible", webview.id, true);
        webview.visible = false;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setVisible", webview.id, false);
    });

    it("can create a webview instance that can have its activity changed", function () {
        var webview = webviewFactory.create();
        webview.active = true;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setActive", webview.id, true);
        webview.active = false;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setActive", webview.id, false);
    });
    
    it("can create a webview instance that can have it's zOrder changed", function () {
        var webview = webviewFactory.create();
        webview.zOrder = 0;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setZOrder", webview.id, 0);
        webview.zOrder = -99;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setZOrder", webview.id, -99);
    });

    it("can create a webview instance that can have its geometry set", function () {
        var webview = webviewFactory.create();
        //Need to call using prototype for no good reason
        webview.prototype.setGeometry(0, 0, 0, 0);
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setGeometry", webview.id, 0, 0, 0, 0);
    });

});
