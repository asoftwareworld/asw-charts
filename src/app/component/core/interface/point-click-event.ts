/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
export interface PointClickEvent {
    id: string | undefined;
    name: string | undefined;
    value: number | null | undefined;
    percentage: number | undefined;
    target: number | undefined;
}

export interface ChartPointerEvent {
    index: number | undefined;
    name: string | undefined;
    value: number | null | undefined;
    category: string | undefined;
}
