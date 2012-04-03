var srcPath = __dirname + "/../../../lib/";

describe("chrome", function () {
        
    var chrome = require(srcPath + "chrome");

    beforeEach(function () {
    });

    it("has an id property", function () {
        expect(chrome.id).toEqual(1);
    });

});
