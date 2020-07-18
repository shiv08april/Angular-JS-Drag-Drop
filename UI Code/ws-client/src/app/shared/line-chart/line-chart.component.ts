import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { KafkaState } from 'src/app/state/kafka.state';
import { Observable } from 'rxjs';
import * as Highcharts from 'highcharts';
import { FileAge } from '../FileAgeConstants';
import { FileAgeServiceService } from '../services/file-age-service.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogTableComponent } from '../dialog-table/dialog-table/dialog-table.component';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
  displayedColumns = ['fileName', 'filePath', 'modifiedDate'];
  fileDetails: any = [];
  dataSource = new MatTableDataSource();
  @Select(KafkaState.messages)
  lineChartData: Observable<any[]>;

  lineChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Count'
        },
        ticks: {
          beginAtZero: true,
          major: {
            fontStyle: 'bold',
            fontColor: '#FF0000'
          }
        }
      }],
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: ''
        },
        ticks: {
          beginAtZero: true,
          min: 0,
          major: {
            fontStyle: 'bold',
            fontColor: '#FF0000'
          }
        }
      }]
    }
  };

  public mlineChartLabels: string[] = ['0', '<30 Min', '<60 Min', '<90 Min', '<120 Min', 'Others'];
  public lineChartType = 'line';
  public lineChartLegend = true;
  public lineChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(105,159,177,0.2)',
      borderColor: 'rgba(105,159,177,1)',
      pointBackgroundColor: 'rgba(105,159,177,1)',
      pointBorderColor: '#fafafa',
      pointHoverBackgroundColor: '#fafafa',
      pointHoverBorderColor: 'rgba(105,159,177)'
    },
    {
      backgroundColor: 'rgba(77,20,96,0.3)',
      borderColor: 'rgba(77,20,96,1)',
      pointBackgroundColor: 'rgba(77,20,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,20,96,1)'
    }
  ];

  lineDataChart: any[] = [{ data: [], label: 'File Count' }];

  constructor(private readonly fileAgeService: FileAgeServiceService,
    // tslint:disable-next-line:align
    private dialog: MatDialog) { }

  ngOnInit() {
    this.lineChartData.subscribe(data => {
      if (data.length > 0) {
        this.filterLineChartValues(data);
      }
    });
  }


  formatNesterArrayList(list) {
    const parseList = JSON.parse(list);
    const filterLineChartData = parseList.map(item => {
      return item.count;
    });

    const unshiftElementArray = [0].concat(filterLineChartData);
    this.lineDataChart = [];
    this.lineDataChart.push({ data: unshiftElementArray, label: 'File Count' });
  }

  filterLineChartValues(data) {
    data.forEach(item => {
      this.formatNesterArrayList(item);
    });
  }

  public chartClicked(event: any): void {
    console.log('event.active[0]._index', event.active[0]._index);
    if (event.active.length > 0) {
      const fileAge = FileAge[event.active[0]._index];
      this.fileAgeService.fetchFileDetailsByDuration(fileAge).subscribe(data => {
        this.fileDetails = data;
        this.openAlertDialog(this.fileDetails);
      }, error => {
        console.log(error);
      });
    }
  }

  openAlertDialog(details) {
    const dialogRef = this.dialog.open(DialogTableComponent, {
      data: {
        message: details
      }
    });
  }
}
