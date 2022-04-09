/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */

export interface SankeyChartPointerEvent {
    name: string | undefined;
    from: string | undefined;
    to: string | undefined;
    weight: number | null | undefined;
    sum: number | null | undefined;
}
