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
 *
 *  NOTE: Taken from the Ripple-UI project
 *        https://github.com/blackberry/Ripple-UI/
 *
 *  MODIFICATIONS
 *      - renamed 'on' apis/methods to 'emit'
 *      - removed getEventSubscribers/eventHasSubscriber methods
 *      - remove usage of ripple's exception/utils modules
 *
 */
/**#nocode+*/

var _listeners = {};

function listenersFor(id, type, create) {
    var result = _listeners[id] || [];

    if (!id) {
        throw "id must be truthy";
    }
    if (!type) {
        throw "type must be truthy";
    }

    result = result[type];

    if (!result && create) {
        _listeners[id] = _listeners[id] || [];
        _listeners[id][type] = []; //Cannot exist
        result = _listeners[id][type]; //Pass by reference
    }
    
    return result;
}
    
function on(id, type, listener, scope, once) {
    var listeners = listenersFor(id, type, true);
    listeners.push({
        func: listener,
        scope: scope,
        once: !!once
    });
}

function emit(listener, args, sync) {
    try {
        if (sync) {
            listener.func.apply(listener.scope, args);
        } else {
            setTimeout(function () {
                listener.func.apply(listener.scope, args);
            }, 1);
        }
    } catch (e) {
        console.error(e && e.stack || e);
    }
}

function removeEventListener(id, type, targetListener, scope, once) { 
    var listeners = listenersFor(id, type),
        i;
    
    if (listeners) {
        for (i = 0; i < listeners.length; i++) {
            if (listeners[i].func === targetListener) {
                delete listeners[i];
                break;
            }
        }
    }
}

module.exports = {
    on: function (id, type, listener, scope) {
        on(id, type, listener, scope);
    },

    once : function (id, type, listener, scope) {
        on(id, type, listener, scope, true);
    },

    emit: function (id, type, args, sync) {
        var listeners = listenersFor(id, type);
        args = args || [];
        sync = sync || false;

        if (listeners) {
            listeners.forEach(function (listener) {
                emit(listener, args, sync);
            });

            //This array must exist or we wouldn't hit this block
            _listeners[id][type] = listeners.filter(function (listener) {
                return !listener.once;
            });
        }
    },

    removeEventListener: removeEventListener,

    clear: function (id) {
        if (id) {
            delete _listeners[id];
        }
    }
};
/**#nocode-*/
