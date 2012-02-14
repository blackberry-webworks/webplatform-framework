var srcPath = __dirname + "/../../../../lib/",
    internal,
    webkitEvent = require(srcPath + "webkitEvent"),
    utils = require(srcPath + "utils");

describe("internal", function () {
    
    var mockedQnx = require(srcPath + "mockedObjects").mockedQnx; 

    describe("the webEvent method", function () {
        
        beforeEach(function () {
            spyOn(utils, "getQnxNamespace").andReturn(mockedQnx);
            spyOn(webkitEvent, "emit");
            internal = require(srcPath + "chrome/internal");
        });

        it("emits an event", function () {
            var id = 42,
                eventType = "Created";
            internal.webEvent(id, eventType);
            expect(webkitEvent.emit).toHaveBeenCalled();
        });


        it("emits an event", function () {
            var id = 42,
                eventType = "Created";
            internal.webEvent(id, eventType);
            expect(webkitEvent.emit).toHaveBeenCalled();
        });

        it("emits an event with the expected id and eventId", function () {
            var inputId = 42,
                inputEventType = "Created",
                value = "Some value";
            internal.webEvent(inputId, inputEventType, value);
            expect(webkitEvent.emit).toHaveBeenCalledWith(inputEventType, [value]
            );
        });

        it("prints an error message when the eventType is invalid", function () {
            var id = 42,
                eventType = "InvalidCity",
                value = "Welcome to invalid city";

            internal.webEvent(id, eventType, value);
            expect(webkitEvent.emit).not.toHaveBeenCalled();
            expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith(
                "webview.printToStderr", 1, "Unknown Event: " + 
                eventType + ":" + value + "\n");
        });
    });
});
