/**
 * @license
 * Copyright ASW (A Software World) All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
import { GridOptionsEnum } from '@asoftwareworld/charts/core';
export class ObjectUtils {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0dXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9hcHAvY29tcG9uZW50L3V0aWxzL29iamVjdHV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUU5RCxNQUFNLE9BQU8sV0FBVztJQUNiLE1BQU0sQ0FBQyxjQUFjLENBQUMsY0FBc0I7UUFDL0MsSUFBSSxjQUFjLElBQUksSUFBSSxFQUFFO1lBQ3hCLE9BQU8sZUFBZSxDQUFDLGVBQWUsQ0FBQztTQUMxQzthQUFNLElBQUksY0FBYyxJQUFJLElBQUksRUFBRTtZQUMvQixPQUFPLGVBQWUsQ0FBQyxVQUFVLENBQUM7U0FDckM7YUFBTSxJQUFJLGNBQWMsSUFBSSxHQUFHLEVBQUU7WUFDOUIsT0FBTyxlQUFlLENBQUMsS0FBSyxDQUFDO1NBQ2hDO2FBQU0sSUFBSSxjQUFjLElBQUksR0FBRyxFQUFFO1lBQzlCLE9BQU8sZUFBZSxDQUFDLE1BQU0sQ0FBQztTQUNqQzthQUFNLElBQUksY0FBYyxJQUFJLEdBQUcsRUFBRTtZQUM5QixPQUFPLGVBQWUsQ0FBQyxLQUFLLENBQUM7U0FDaEM7YUFBTSxJQUFJLGNBQWMsR0FBRyxHQUFHLEVBQUU7WUFDN0IsT0FBTyxlQUFlLENBQUMsVUFBVSxDQUFDO1NBQ3JDO2FBQU07WUFDSCxPQUFPLGVBQWUsQ0FBQyxVQUFVLENBQUM7U0FDckM7SUFDTCxDQUFDO0NBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IEFTVyAoQSBTb2Z0d2FyZSBXb3JsZCkgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cclxuICpcclxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcclxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEdyaWRPcHRpb25zRW51bSB9IGZyb20gJ0Bhc29mdHdhcmV3b3JsZC9jaGFydHMvY29yZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgT2JqZWN0VXRpbHMge1xyXG4gICAgcHVibGljIHN0YXRpYyBmaW5kRGV2aWNlU2l6ZShjb250YWluZXJXaWR0aDogbnVtYmVyKTogR3JpZE9wdGlvbnNFbnVtIHtcclxuICAgICAgICBpZiAoY29udGFpbmVyV2lkdGggPj0gMTQwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gR3JpZE9wdGlvbnNFbnVtLkV4dHJhRXh0cmFMYXJnZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRhaW5lcldpZHRoID49IDEyMDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIEdyaWRPcHRpb25zRW51bS5FeHRyYUxhcmdlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGFpbmVyV2lkdGggPj0gOTkyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBHcmlkT3B0aW9uc0VudW0uTGFyZ2U7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250YWluZXJXaWR0aCA+PSA3NjgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEdyaWRPcHRpb25zRW51bS5NZWRpdW07XHJcbiAgICAgICAgfSBlbHNlIGlmIChjb250YWluZXJXaWR0aCA+PSA1NzYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIEdyaWRPcHRpb25zRW51bS5TbWFsbDtcclxuICAgICAgICB9IGVsc2UgaWYgKGNvbnRhaW5lcldpZHRoIDwgNTc2KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBHcmlkT3B0aW9uc0VudW0uRXh0cmFTbWFsbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gR3JpZE9wdGlvbnNFbnVtLkV4dHJhU21hbGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==