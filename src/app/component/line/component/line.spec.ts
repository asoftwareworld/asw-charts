import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Line } from './line';

describe('Line', () => {
    let component: Line;
    let fixture: ComponentFixture<Line>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Line]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(Line);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
