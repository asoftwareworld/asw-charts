/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */

import { GridOptionsEnum } from '@asoftwareworld/charts/core';

export class ObjectUtils {
    public static findDeviceSize(containerWidth: number): GridOptionsEnum {
        if (containerWidth >= 1400) {
            return GridOptionsEnum.ExtraExtraLarge;
        } else if (containerWidth >= 1200) {
            return GridOptionsEnum.ExtraLarge;
        } else if (containerWidth >= 992) {
            return GridOptionsEnum.Large;
        } else if (containerWidth >= 768) {
            return GridOptionsEnum.Medium;
        } else if (containerWidth >= 576) {
            return GridOptionsEnum.Small;
        } else if (containerWidth < 576) {
            return GridOptionsEnum.ExtraSmall;
        } else {
            return GridOptionsEnum.ExtraSmall;
        }
    }
}
