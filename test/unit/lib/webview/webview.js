var srcPath = __dirname + "/../../../../lib/";

describe("webview", function () {
        
    var Webview,
        mockedQnx = require(srcPath + "../test/mockedObjects").mockedQnx,
        utils = require(srcPath + "utils"),
        events = require(srcPath + "events"),
        chrome = require(srcPath + "chrome");

    beforeEach(function () {
        spyOn(utils, "getQnxNamespace").andReturn(mockedQnx);
        Webview = require(srcPath + "webview/webview");
    });

    it("can create a webview instance", function () {
        var webview = new Webview();
        expect(webview.id).toEqual(jasmine.any(Number));
        expect(webview.windowGroup).toEqual(jasmine.any(Number));
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.applicationWindowGroup", chrome.id);
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.create", jasmine.any(Number), "InProcess");
    });

    it("can create a webview with a specific id", function () {
        var options = {webviewId : 42},
            webview = new Webview(options);
        expect(webview.id).toEqual(42);
    });
    
    it("can create a webview instance that can be destroyed", function () {
        var webview = new Webview(),
            webviewId = webview.id;
        spyOn(events, "clear");
        webview.destroy();
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.destroy", webview.id);
        expect(events.clear).toHaveBeenCalledWith(webviewId);
    });
   
   
    it("can create a webview instance that can set a url", function () {
        var webview = new Webview(),
            url = "http://www.google.com";
        webview.url = url;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.loadURL", jasmine.any(Number), url);
    });

    it("can create a webview instance that can get a URL", function () {
        var webview = new Webview();
        expect(webview.url).toBeDefined();
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.location", webview.id);
    });
    
    it("can create a webview instance that can execute javascript", function () {
        var webview = new Webview(),
            jsExpression = "var a = 'awesome';";
        webview.executeJavaScript(jsExpression);
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.executeJavaScript", jasmine.any(Number), jsExpression, false);
    });

    it("can create a webview instance that can retrieve its visibility", function () {
        var webview = new Webview();
        expect(webview.visible).toBeDefined();
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.isVisible", webview.id);
    });
    
    it("can create a webview instance that can have its visibility changed", function () {
        var webview = new Webview();
        webview.visible = true;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setVisible", webview.id, true);
        webview.visible = false;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setVisible", webview.id, false);
    });

    it("can create a webview instance that can retrieve its activity", function () {
        var webview = new Webview();
        expect(webview.active).toBeDefined();
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.isActive", webview.id);
    });
    
    it("can create a webview instance that can have its activity changed", function () {
        var webview = new Webview();
        webview.active = true;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setActive", webview.id, true);
        webview.active = false;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setActive", webview.id, false);
    });
    
    it("can create a webview instance that can retrieve its zOrder", function () {
        var webview = new Webview();
        expect(webview.zOrder).toBeDefined();
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.zOrder", webview.id);
    });
    
    it("can create a webview instance that can have it's zOrder changed", function () {
        var webview = new Webview();
        webview.zOrder = 0;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setZOrder", webview.id, 0);
        webview.zOrder = -99;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setZOrder", webview.id, -99);
    });

    it("can create a webview instance that can have its geometry set", function () {
        var webview = new Webview();
        webview.setGeometry(0, 0, 0, 0);
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setGeometry", webview.id, 0, 0, 0, 0);
    });

    it("can create a webview instance that can have its background color set", function () {
        var webview = new Webview();
        webview.setBackgroundColor("0x00FFFF00");
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("webview.setBackgroundColor", webview.id, "0x00FFFF00");
    });

    it("can create a webview instance that can listen to events", function () {
        var webview = new Webview(),
            callback = function () {};
        spyOn(events, "on");
        webview.addEventListener("Created", callback);
        expect(events.on).toHaveBeenCalledWith(webview.id, "Created", callback);
    });

    it("can create a webview instance that can dispatch events", function () {
        var webview = new Webview(),
            callback = jasmine.createSpy(),
            args = ["one", "two", "many"];
        spyOn(events, "on").andCallThrough();
        webview.addEventListener("Created", callback);
        expect(events.on).toHaveBeenCalledWith(
            webview.id, "Created", callback);

        spyOn(events, "emit").andCallThrough();
        webview.dispatchEvent("Created", args);
        expect(events.emit).toHaveBeenCalledWith(
            webview.id, "Created", args);

        waits(1);
        runs(function () {
            expect(callback).toHaveBeenCalledWith(args[0], args[1], args[2]);
        });
    });
    
    it("can create a webview instance that can remove a single event listener", function () {
        var webview = new Webview(),
            eventType = "Created",
            callback = jasmine.createSpy();
        spyOn(events, "removeEventListener");
        webview.removeEventListener(eventType, callback);
        expect(events.removeEventListener).toHaveBeenCalledWith(webview.id, eventType, callback);
    });

});
