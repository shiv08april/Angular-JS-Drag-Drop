import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxsModule } from '@ngxs/store';
import { NgxsWebsocketPluginModule } from '@ngxs/websocket-plugin';
import { KafkaState } from './state/kafka.state';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BarchartComponent } from './shared/barchart/barchart.component';
import { ChartsModule } from 'ng2-charts';
import { LineChartComponent } from './shared/line-chart/line-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { AppLocalConfig } from './config/app.local.config';
import { FileAgeServiceService } from './shared/services/file-age-service.service';
import { DialogTableComponent } from './shared/dialog-table/dialog-table/dialog-table.component';
import { TreeNodeComponent } from './shared/TreeNode/tree-node/tree-node.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTreeModule } from '@angular/material/tree';
import {DragDropModule} from "@angular/cdk/drag-drop";
@NgModule({
  declarations: [
    AppComponent,
    BarchartComponent,
    LineChartComponent,
    DialogTableComponent,
    TreeNodeComponent
  ],
    imports: [
        MatPaginatorModule,
        MatTreeModule,
        MatCheckboxModule,
        MatFormFieldModule,
        CdkTreeModule,
        ChartsModule,
        HttpClientModule,
        MatToolbarModule,
        MatIconModule, MatSidenavModule, MatListModule, MatButtonModule,
        FlexLayoutModule,
        BrowserModule,
        MatTableModule,
        MatButtonModule,
        AppRoutingModule,
        MatDialogModule,
        NgxsModule.forRoot([
            KafkaState
        ]),
        NgxsWebsocketPluginModule.forRoot({
            url: 'ws://localhost:8080/websocket'
        }),
        BrowserAnimationsModule, DragDropModule
    ],
  providers: [AppLocalConfig, FileAgeServiceService],
  entryComponents: [DialogTableComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
