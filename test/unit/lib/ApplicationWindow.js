var srcPath = __dirname + "./../../../lib/";

describe("ApplicationWindow", function () {

    var ApplicationWindow,
        mockedQnx;

    beforeEach(function () {
        mockedQnx = {callExtensionMethod : jasmine.createSpy()};
        GLOBAL.qnx = mockedQnx;
        ApplicationWindow = require(srcPath + "ApplicationWindow");
    });

    it("can create an ApplicationWinow instance", function () {
        var appWindow = new ApplicationWindow();
        expect(appWindow).toBeDefined();
    });

    it("can create a webview instance that can have its visibility changed", function () {
        var appWindow = new ApplicationWindow();
        expect(appWindow.visible).toBeDefined();
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("applicationWindow.isVisible");
        appWindow.visible = true;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("applicationWindow.setVisible", true);
        appWindow.visible = false;
        expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith("applicationWindow.setVisible", false);
    });
});
