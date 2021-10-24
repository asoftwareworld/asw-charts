/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */

import { Type, ɵstringify as stringify } from '@angular/core';

export function invalidPipeArgumentError(type: Type<any>, value: any): any {
    return Error(`InvalidPipeArgument: '${value}' for pipe '${stringify(type)}'`);
}
