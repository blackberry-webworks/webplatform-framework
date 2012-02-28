/*
 *  Copyright 2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var srcPath = __dirname + '/../../../lib/';

describe("event", function () {
    var event = require(srcPath + 'webkitEvent');
    
    describe("the on method", function () {
        afterEach(function () {
            event.clear("test on");
        });

        it("registers an event", function () {
            expect(function () {
                event.on("test on", function () {});
            }).not.toThrow();
        });

        it("should throw an exception if registering for something falsy", function () {
            expect(function () {
                event.on(null, function () {});
            }).toThrow();
        });
    });

    describe("emit", function () {
        afterEach(function () {
            event.clear("test emit");
        });

        it("can call the listener sync", function () {
            var spy = jasmine.createSpy();
            event.on("test emit", spy);
            event.emit("test emit", [], true);
            expect(spy).toHaveBeenCalled();
        });

        it("can call the listener async", function () {
            var spy = jasmine.createSpy();
            event.on({id : 1, eventType : "Created"}, spy);
            event.emit({id: 1, eventType : "Created"}, [], false);
            expect(spy).not.toHaveBeenCalled();
            waits(1);
            runs(function () {
                expect(spy).toHaveBeenCalled();
            });
        });

        it("passes the arguments", function () {
            var spy = jasmine.createSpy();
            event.on("test emit", spy);
            event.emit("test emit", ["larry", "curly", "moe"], true);
            expect(spy).toHaveBeenCalledWith("larry", "curly", "moe");
        });

        it("sets the scope for the listener", function () {
            var kittens = {};
            event.on("test emit", function () {
                expect(this).toBe(kittens);
            }, kittens);
            event.emit("test emit", [], true);
        });

        it("should call the listener async by default", function () {
            var spy = jasmine.createSpy();
            event.on("test emit", spy);
            event.emit("test emit");
            expect(spy).not.toHaveBeenCalled();
            waits(1);
            runs(function () {
                expect(spy).toHaveBeenCalled();
            });
        });
    });

    describe("removeEventListener", function () {
        
        afterEach(function () {
            event.clear({id: 42, eventType: "test event"});
        });

        it("removes a subscriber for an event type", function () {
            var identifier = {id: 42, eventType: "test event"}, 
                spy = jasmine.createSpy();
            event.on(identifier, spy);
            event.removeEventListener(identifier, spy);
            event.emit(identifier, null, true);

            expect(spy).not.toHaveBeenCalled();
        });

        it("removes a specific subscriber for an event type", function () {
            var identifier = {id: 42, eventType: "test event"},
                jamesBond = jasmine.createSpy("bond"),
                alecTrevelyan = jasmine.createSpy("trevelyan");
            event.on(identifier, alecTrevelyan);
            event.on(identifier, jamesBond);
            event.removeEventListener(identifier, alecTrevelyan);
            event.emit(identifier, null, true);

            expect(alecTrevelyan).not.toHaveBeenCalled();
            expect(jamesBond).toHaveBeenCalled();
        });

        it("throws an exception when the event is not truthy", function () {
            var identifier = {id: 42, eventType: "test event"},
                spy = jasmine.createSpy();
            event.on(identifier, spy);
            expect(function () {
                event.removeEventListener(false, spy);
            }).toThrow();
            event.emit(identifier, null, true);
            expect(spy).toHaveBeenCalled();
        });

    });

    describe("clear", function () {
        afterEach(function () {
            event.clear("test clear");
        });

        it("removes all subscribers for an event type", function () {
            var spy = jasmine.createSpy();
            event.on("test clear", spy);

            event.clear("test clear");
            event.emit("test clear", null, true);

            expect(spy).not.toHaveBeenCalled();
        });

        it("clear with no params removes no subscribers", function () {
            var spy = jasmine.createSpy();

            event.on("test clear", spy);
            event.clear();
            event.emit("test clear", null, true);

            expect(spy).toHaveBeenCalled();
        });
    });

    describe("once", function () {
        afterEach(function () {
            event.clear("test once");
        });

        it("test once only gets emitted once", function () {
            var func = jasmine.createSpy();
            event.once("test once", func);
            event.emit("test once");
            event.emit("test once");
            waits(1);
            runs(function () {
                expect(func.callCount).toEqual(1);
            });
        });
    });
});
