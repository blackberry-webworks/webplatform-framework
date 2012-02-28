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

function on(type, listener, scope, once) {
    if (!type) {
        throw "type must be truthy";
    }
    _listeners[type] = _listeners[type] || [];
    _listeners[type].push({
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

function removeEventListener(type, targetListener) { 
    var listeners,
        i;
    if (!type) {
        throw "type must be truthy";
    }
    
    listeners = _listeners[type];
    if (listeners) {
        for (i = 0; i < listeners.length; i++) {
            if (listeners[i].func === targetListener) {
                _listeners[type].splice(i, 1);
                break;
            }
        }
    }
}

module.exports = {
    on: function (type, listener, scope) {
        on(type, listener, scope);
    },

    once: function (type, listener, scope) {
        on(type, listener, scope, true);
    },

    emit: function (type, args, sync) {
        var listeners = _listeners[type];
        args = args || [];
        sync = sync || false;

        if (listeners) {
            listeners.forEach(function (listener) {
                emit(listener, args, sync);
            });

            _listeners[type] = listeners.filter(function (listener) {
                return !listener.once;
            });
        }
    },

    removeEventListener: removeEventListener,

    clear: function (type) {
        if (type) {
            delete _listeners[type];
        }
    }
};
/**#nocode-*/
