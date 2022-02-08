(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@asoftwareworld/charts/core')) :
    typeof define === 'function' && define.amd ? define('@asoftwareworld/charts/utils', ['exports', '@asoftwareworld/charts/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.asoftwareworld = global.asoftwareworld || {}, global.asoftwareworld.charts = global.asoftwareworld.charts || {}, global.asoftwareworld.charts.utils = {}), global.asoftwareworld.charts.core));
}(this, (function (exports, core) { 'use strict';

    /**
     * @license
     * Copyright ASW (A Software World) All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file
     */
    var ObjectUtils = /** @class */ (function () {
        function ObjectUtils() {
        }
        ObjectUtils.findDeviceSize = function (containerWidth) {
            if (containerWidth >= 1400) {
                return core.GridOptionsEnum.ExtraExtraLarge;
            }
            else if (containerWidth >= 1200) {
                return core.GridOptionsEnum.ExtraLarge;
            }
            else if (containerWidth >= 992) {
                return core.GridOptionsEnum.Large;
            }
            else if (containerWidth >= 768) {
                return core.GridOptionsEnum.Medium;
            }
            else if (containerWidth >= 576) {
                return core.GridOptionsEnum.Small;
            }
            else if (containerWidth < 576) {
                return core.GridOptionsEnum.ExtraSmall;
            }
            else {
                return core.GridOptionsEnum.ExtraSmall;
            }
        };
        return ObjectUtils;
    }());

    /**
     * @license
     * Copyright ASW (A Software World) All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.ObjectUtils = ObjectUtils;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=asoftwareworld-charts-utils.umd.js.map
