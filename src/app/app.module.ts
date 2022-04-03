import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AswPieDonutModule } from '@asoftwareworld/charts/pie-donut';
import { AswSemiCircleDonutModule } from '@asoftwareworld/charts/semi-circle-donut';
import { AswLineModule } from '@asoftwareworld/charts/line';
import { AswBarColumnModule } from '@asoftwareworld/charts/bar-column';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserAnimationsModule,
        AswPieDonutModule,
        AswSemiCircleDonutModule,
        AswLineModule,
        AswBarColumnModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
