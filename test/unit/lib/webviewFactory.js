var srcPath = __dirname + "/../../../lib/";

describe("webviewFactory", function () {
        
    var webviewFactory,
        mockedQnx = require(srcPath + "mockedObjects").mockedQnx,
        utils = require(srcPath + "utils");

    beforeEach(function () {
        spyOn(utils, "getQnxNamespace").andReturn(mockedQnx);
        webviewFactory = require(srcPath + "webviewFactory");
    });

    it("can create a webview instance", function () {
        var webview = webviewFactory.createWebview();
        expect(webview.id).toEqual(jasmine.any(Number));
        expect(webview.windowGroup).toEqual(jasmine.any(Number));
        expect(webview.visible).toEqual(false);
        expect(webview.active).toEqual(false);
        expect(webview.zOrder).toEqual(jasmine.any(Number));
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.applicationWindowGroup", 1);
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.create", jasmine.any(Number), "InProcess");
    });
    
    it("can create a webview instance that can be destroyed", function () {
        var webview = webviewFactory.createWebview();
        webview.destroy();
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.destroy", jasmine.any(Number));
    });
   
    it("can create a webview instance that can set a url", function () {
        var webview = webviewFactory.createWebview(),
            url = "http://www.google.com";
        webview.setURL(url);
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.loadURL", jasmine.any(Number), url);
    });

    it("can create a webview instance that can execute javascript", function () {
        var webview = webviewFactory.createWebview(),
            jsExpression = "var a = 'awesome';";
        webview.executeJavaScript(jsExpression);
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.executeJavaScript", jasmine.any(Number), jsExpression, false);
    });

    it("can create a webview instance that can have its visibility changed", function () {
        var webview = webviewFactory.createWebview();
        webview.visible = true;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setVisible", webview.id, true);
        webview.visible = false;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setVisible", webview.id, false);
    });

    it("can create a webview instance that can have its activity changed", function () {
        var webview = webviewFactory.createWebview();
        webview.active = true;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setActive", webview.id, true);
        webview.active = false;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setActive", webview.id, false);
    });
    
    it("can create a webview instance that can have it's zOrder changed", function () {
        var webview = webviewFactory.createWebview();
        webview.zOrder = 0;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setZOrder", webview.id, 0);
        webview.zOrder = -99;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setZOrder", webview.id, -99);
    });

    it("can create a webview instance that can have its geometry set", function () {
        var webview = webviewFactory.createWebview();
        webview.setGeometry(0, 0, 0, 0);
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setGeometry", webview.id, 0, 0, 0, 0);
    });

    it("can create a webview instance that can have its background color set", function () {
        var webview = webviewFactory.createWebview();
        webview.setBackgroundColor("0x00FFFF00");
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setBackgroundColor", webview.id, "0x00FFFF00");
    });

});

describe("some test", function () {

    beforeEach(function () {
       // webviewFactory = require(srcPath + "webviewFactory");
        utils = require(srcPath + "utils");
        mockedQnx = require(srcPath + "mockedObjects").mockedQnx; 
        webviewFactory = require(srcPath + "webviewFactory");
    });

    it("can create a webview instance", function () {
        var webview = webviewFactory.createWebview();
        expect(webview.id).toEqual(jasmine.any(Number));
        expect(webview.windowGroup).toEqual(jasmine.any(Number));
        expect(webview.visible).toEqual(false);
        expect(webview.active).toEqual(false);
        expect(webview.zOrder).toEqual(jasmine.any(Number));
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.applicationWindowGroup", 1);
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.create", jasmine.any(Number), "InProcess");
    });
    
});
