import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AswSankeyChart } from './sankey-chart';

describe('AswSankeyChart', () => {
    let component: AswSankeyChart;
    let fixture: ComponentFixture<AswSankeyChart>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AswSankeyChart]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AswSankeyChart);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
