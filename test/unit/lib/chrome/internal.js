var srcPath = __dirname + "/../../../../lib/",
    internal,
    mockedQnx,
    events = require(srcPath + "events"),
    chrome = require(srcPath + "chrome"),
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
    
    describe("the webEvent method", function () {
        
        beforeEach(function () {
            mockedQnx = { callExtensionMethod : jasmine.createSpy()};
            GLOBAL.qnx = mockedQnx;
            spyOn(events, "emit");
            internal = require(srcPath + "chrome/internal");
        });

        it("emits an event", function () {
            var id = 42,
                eventType = "Created";
            internal.webEvent(id, eventType);
            expect(events.emit).toHaveBeenCalled();
        });

        it("emits an event with the expected id and eventId", function () {
            var inputId = 42,
                inputEventType = "Created",
                value = "Some value";
            internal.webEvent(inputId, inputEventType, value);
            expect(events.emit).toHaveBeenCalledWith(
                inputId, inputEventType, [value]);
        });

        it("prints an error message when the eventType is invalid", function () {
            var id = 42,
                eventType = "InvalidCity",
                value = "Welcome to invalid city";

            internal.webEvent(id, eventType, value);
            expect(events.emit).not.toHaveBeenCalled();
            expect(mockedQnx.callExtensionMethod).toHaveBeenCalledWith(
                "webview.printToStderr", chrome.id, "Unknown Event: " + 
                eventType + ":" + value + "\n");
        });

        it("emits the proper event for all event types", function () {
            var id = 42;
            eventTypes.forEach(function (eventType) {
                internal.webEvent(id, eventType, eventType);
                expect(events.emit).toHaveBeenCalledWith(
                    id, eventType, [eventType]);
            });
        });
    });
});
