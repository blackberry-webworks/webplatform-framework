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
            event.clear("testId");
        });

        it("registers an event", function () {
            expect(function () {
                event.on("testId", "test on", function () {});
            }).not.toThrow();
        });

        it("should throw an exception if the ID is falsy", function () {
            expect(function () {
                event.on(0, "test on", function () {});
            }).toThrow();
        });
        
        it("should throw an exception if the ID is falsy", function () {
            expect(function () {
                event.on("testId", undefined, function () {});
            }).toThrow();
        });
    });

    describe("emit", function () {
        afterEach(function () {
            event.clear("testId");
        });

        it("can call the listener sync", function () {
            var spy = jasmine.createSpy();
            event.on("testId", "testType",  spy);
            event.emit("testId", "testType", [], true);
            expect(spy).toHaveBeenCalled();
        });

        it("can call the listener async", function () {
            var spy = jasmine.createSpy();
            event.on("testId", "testType",  spy);
            event.emit("testId", "testType", [], false);
            expect(spy).not.toHaveBeenCalled();
            waits(1);
            runs(function () {
                expect(spy).toHaveBeenCalled();
            });
        });

        it("passes the arguments", function () {
            var spy = jasmine.createSpy();
            event.on("testId", "Stooges", spy);
            event.emit("testId", "Stooges", ["larry", "curly", "moe"], true);
            expect(spy).toHaveBeenCalledWith("larry", "curly", "moe");
        });

        it("sets the scope for the listener", function () {
            var kittens = {};
            event.on("testId", "Fluffy", function () {
                expect(this).toBe(kittens);
            }, kittens);
            event.emit("testId", "Fluffy", [], true);
        });

        it("should call the listener async by default", function () {
            var spy = jasmine.createSpy();
            event.on("testId", "testType", spy);
            event.emit("testId", "testType");
            expect(spy).not.toHaveBeenCalled();
            waits(1);
            runs(function () {
                expect(spy).toHaveBeenCalled();
            });
        });

        it("should only call the desired listners", function () {
            var austinPowers = jasmine.createSpy(),
                alottaFagina = jasmine.createSpy(),
                felicityShagwell = jasmine.createSpy();

            event.on("testId", "Austin", austinPowers);
            event.on("testId", "Alotta", alottaFagina);
            event.on("testId", "Felicity", felicityShagwell);

            event.emit("testId", "Austin");
            event.emit("testId", "Austin");
            event.emit("testId", "Alotta");
            event.emit("testId", "FatBastard");

            waits(3);
            runs(function () {
                expect(austinPowers.callCount).toEqual(2);
                expect(alottaFagina.callCount).toEqual(1);
                expect(felicityShagwell.callCount).toEqual(0);
            });
        });
    });

    describe("removeEventListener", function () {
        
        afterEach(function () {
            event.clear(42);
        });

        it("removes a subscriber for an event type", function () {
            var spy = jasmine.createSpy();
            event.on(42, "test event", spy);
            event.removeEventListener(42, "test event", spy);
            event.emit(42, "test event", null, true);

            expect(spy).wasNotCalled();
        });

        it("removes a specific subscriber for an event type", function () {
            var jamesBond = jasmine.createSpy("bond"),
                alecTrevelyan = jasmine.createSpy("trevelyan");
            event.on(42, "villain", alecTrevelyan);
            event.on(42, "hero", jamesBond);
            event.removeEventListener(42, "villain", alecTrevelyan);
            event.emit(42, "villain", null, true);
            event.emit(42, "hero", null, true);

            expect(alecTrevelyan).wasNotCalled();
            expect(jamesBond).toHaveBeenCalled();
        });

        it("throws an exception when the event is not truthy", function () {
            var spy = jasmine.createSpy();
            expect(function () {
                event.removeEventListener(false, spy);
            }).toThrow();
        });

        it("does not remove a listener when throwing an error", function () {
            var spy = jasmine.createSpy();
            event.on(42, "Truthy", spy);
            expect(function () {
                event.removeEventListener(false, spy);
            }).toThrow();
            event.emit(42, "Truthy", null, true);
            expect(spy).toHaveBeenCalled();
        });


    });

    describe("clear", function () {
        afterEach(function () {
            event.clear("test clear");
        });

        it("removes all subscribers for an id", function () {
            var spy = jasmine.createSpy();
            event.on("test clear", "type", spy);

            event.clear("test clear");
            event.emit("test clear", "type", null, true);

            expect(spy).not.toHaveBeenCalled();
        });

        it("clear with no params removes no subscribers", function () {
            var spy = jasmine.createSpy();

            event.on("test clear", "type", spy);
            event.clear();
            event.emit("test clear", "type", null, true);

            expect(spy).toHaveBeenCalled();
        });
    });

    describe("once", function () {
        afterEach(function () {
            event.clear("test once");
        });

        it("test once only gets emitted once", function () {
            var func = jasmine.createSpy();
            event.once("test once", "singular",  func);
            event.emit("test once", "singular");
            event.emit("test once", "singular");
            waits(1);
            runs(function () {
                expect(func.callCount).toEqual(1);
            });
        });
    });
});
