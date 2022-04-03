import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AswLine } from './line';

describe('AswLine', () => {
    let component: AswLine;
    let fixture: ComponentFixture<AswLine>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AswLine]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AswLine);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
