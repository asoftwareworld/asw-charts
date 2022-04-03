import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AswBarColumn } from './bar-column';

describe('AswBarColumn', () => {
    let component: AswBarColumn;
    let fixture: ComponentFixture<AswBarColumn>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AswBarColumn]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AswBarColumn);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
