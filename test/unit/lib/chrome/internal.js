var srcPath = __dirname + "/../../../../lib/",
    internal,
    webkitEvent = require(srcPath + "webkitEvent"),
    utils = require(srcPath + "utils"),
    eventTypes = [
        'PropertyViewportEvent', 
        'QNXWebDestroyedEvent', 
        'Destroyed', 
        'Created', 
        'PropertyLoadProgressEvent', 
        'PropertyLocationEvent', 
        'PropertyTitleEvent', 
        'PropertyCanGoBackEvent', 
        'PropertyCanGoForwardEvent', 
        'PropertyFaviconEvent', 
        'PropertySecureTypeEvent', 
        'JavaScriptResult', 
        'ContentRendered',
        'JavaScriptWindowObjectCleared', 
        'PropertyTooltipEvent', 
        'Created', 
        'DocumentLoadCommitted', 
        'DocumentLoaded', 
        'DocumentLoadFinished', 
        'LocationChange', 
        'LocationChanging', 
        'NetworkError', 
        'PropertyActiveEvent', 
        'PropertyBackgroundColorEvent', 
        'PropertyCertificateInfoEvent', 
        'PropertyContentRectangleEvent',
        'PropertyEnableWebInspectorEvent', 
        'PropertyEncryptionInfoEvent', 
        'PropertyHistoryListEvent', 
        'PropertyHistoryPositionEvent',
        'PropertyJavaScriptInterruptTimeoutEvent', 
        'PropertyOriginalLocationEvent', 
        'PropertyScaleEvent', 
        'PropertyScrollPositionEvent', 
        'PropertyStatusEvent',
        'PropertyVisibleEvent', 
        'PropertyWebInspectorPortEvent'
    ];

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

        it("emits an event with the expected id and eventId", function () {
            var inputId = 42,
                inputEventType = "Created",
                value = "Some value";
            internal.webEvent(inputId, inputEventType, value);
            expect(webkitEvent.emit).toHaveBeenCalledWith(
                {id : inputId, eventType: inputEventType}, [value]);
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

        it("emits the proper event for all event types", function () {
            var id = 42;
            eventTypes.forEach(function (eventType) {
                internal.webEvent(id, eventType, eventType);
                expect(webkitEvent.emit).toHaveBeenCalledWith(
                    {id: id, eventType: eventType}, [eventType]);
            });
        });
    });
});
