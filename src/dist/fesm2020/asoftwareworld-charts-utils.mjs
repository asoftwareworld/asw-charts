import { GridOptionsEnum } from '@asoftwareworld/charts/core';

/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
class ObjectUtils {
    static findDeviceSize(containerWidth) {
        if (containerWidth >= 1400) {
            return GridOptionsEnum.ExtraExtraLarge;
        }
        else if (containerWidth >= 1200) {
            return GridOptionsEnum.ExtraLarge;
        }
        else if (containerWidth >= 992) {
            return GridOptionsEnum.Large;
        }
        else if (containerWidth >= 768) {
            return GridOptionsEnum.Medium;
        }
        else if (containerWidth >= 576) {
            return GridOptionsEnum.Small;
        }
        else if (containerWidth < 576) {
            return GridOptionsEnum.ExtraSmall;
        }
        else {
            return GridOptionsEnum.ExtraSmall;
        }
    }
}

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

export { ObjectUtils };
//# sourceMappingURL=asoftwareworld-charts-utils.mjs.map
