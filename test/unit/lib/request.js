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

describe("request", function () {
    var request,
        message,
        mockedQnx = require(srcPath + "mockedObjects").mockedQnx,
        utils = require(srcPath + "utils");

    beforeEach(function () {
        spyOn(utils, "getQnxNamespace").andReturn(mockedQnx);
        request = require(srcPath + 'request');
        message = require(srcPath + 'message');
    });

/*it("sample test", function () {

});*/
    
    it("has a function called init", function () {
        expect(request.init).toBeDefined();
    });    

    describe("the return value of init", function () {

        it("has a function called allow", function () {
            var args = {
                    data : {
                        url: "http://google.com"
                    },
                    id: 1
                };
            expect(request.init(args).allow).toBeDefined(); 
        });

        it("allow to send message NetworkResourceRequestedResponse ", function () {
            var args = {
                    data : {
                        url: "http://google.com"
                    },
                    id: 1
                },
            requested = request.init(args);
            spyOn(message, "send");
            requested.allow();
            expect(message.send).toHaveBeenCalledWith("NetworkResourceRequestedResponse", { id: args.id, url: args.data.url, response: {setAction: 'ACCEPT'}});

        });

        
        it("has a function called deny", function () {
            var args = {
                    data : {
                        url: "http://google.com"
                    },
                    id: 2
                };
            expect(request.init(args).deny).toBeDefined(); 

        });

        it("deny to send message NetworkResourceRequestedResponse ", function () {
            var args = {
                    data : {
                        url: "http://google.com"
                    },
                    id: 2
                },
            requested = request.init(args);
            spyOn(message, "send");
            requested.deny();
            expect(message.send).toHaveBeenCalledWith("NetworkResourceRequestedResponse", { id: args.id, url: args.data.url, response: {setAction: 'DENY'}});

        });

        it("has a function called substitute", function () {
            var args = {
                    data : {
                        url: "http://google.com"
                    },
                    id: 3
                };
            expect(request.init(args).substitute).toBeDefined(); 
        });

        it("substitute to send message NetworkResourceRequestedResponse ", function () {
            var args = {
                    data : {
                        url: "http://google.com"
                    },
                    id: 3
                },
            requested = request.init(args);
            spyOn(message, "send");
            requested.substitute();
            expect(message.send).toHaveBeenCalledWith("NetworkResourceRequestedResponse", { id: args.id, url: args.data.url, response: {setAction: 'SUBSTITUTE'}});

        });


        it("has a function called respond", function () {
            var args = {
                    data : {
                        url: "http://google.com"
                    },
                    id: 4
                };
            expect(request.init(args).respond).toBeDefined(); 
        });

        it("respond to send message NetworkResourceRequestedResponse ", function () {
            var args = {
                    data : {
                        url: "http://google.com"
                    },
                    id: 4
                },
            requested = request.init(args);
            requested.substitute();
            spyOn(message, "send");
            requested.respond(400, "responseAsHi");
            expect(message.send).toHaveBeenCalledWith("NetworkResourceRequestedResponse", { id: args.id, sid: args.data.streamId, url: args.data.url, response: {code: 400, responseText: "responseAsHi"}}, true);
        });

        it("respondException should occur if send message without substitute ", function () {
            var args = {
                    data : {
                        url: "http://google.com"
                    },
                    id: 4
                },
            requested = request.init(args);
            expect(function(){requested.respond();}).toThrow("Cannot respond until after substitute has been requested");
        });

    });

});
