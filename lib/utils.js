/*
 * Copyright 2010-2011 Research In Motion Limited.
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
/**#nocode+*/

var _self;

_self = {
    inNode: function () {
        return !!require.resolve;
    },

    getQnxNamespace: function () {
        return _self.inNode() ? null : qnx;
    },

    mixIn: function (mixin, to) {
        for (var prop in mixin) {
            if (Object.hasOwnProperty.call(mixin, prop)) {
                to[prop] = mixin[prop];
            }
        }
        return to;
    },

    copy: function (obj) {
        var i,
            newObj = (obj === null ? false : global.toString.call(obj) === "[object Array]") ? [] : {};

        if (typeof obj === 'number' ||
            typeof obj === 'string' ||
            typeof obj === 'boolean' ||
            obj === null ||
            obj === undefined) {
            return obj;
        }

        if (obj instanceof Date) {
            return new Date(obj);
        }

        if (obj instanceof RegExp) {
            return new RegExp(obj);
        }

        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (obj[i] && typeof obj[i] === "object") {
                    if (obj[i] instanceof Date) {
                        newObj[i] = obj[i];
                    }
                    else {
                        newObj[i] = _self.copy(obj[i]);
                    }
                }
                else {
                    newObj[i] = obj[i];
                }
            }
        }

        return newObj;
    }
};

module.exports = _self;

/**#nocode-*/
