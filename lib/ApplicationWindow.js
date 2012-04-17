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

var ApplicationWindow;

/**
 * @class A javascript abstraction of the application window
 * @property {Boolean} visible Whether the application window is visible or not
 */
ApplicationWindow = function () {

    this.__defineGetter__("visible", function () {
        return !!qnx.callExtensionMethod("applicationWindow.isVisible");
    });

    this.__defineSetter__("visible", function (newVisibility) {
        qnx.callExtensionMethod("applicationWindow.setVisible", !!newVisibility);
    });
};

module.exports = ApplicationWindow;
