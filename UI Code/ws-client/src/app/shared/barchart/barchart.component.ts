import { Component, OnInit, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { KafkaState } from 'src/app/state/kafka.state';
import { Observable } from 'rxjs';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit {
  @Select(KafkaState.messages)
  lineChartData: Observable<any[]>;

  barChartOptions: any = {
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
          major: {
            fontStyle: 'bold',
            fontColor: '#FF0000'
          }
        }
      }]
    }
  };

  public mbarChartLabels: string[] = ['<30 Min', '<60 Min', '<90 Min', '< 120 Min', 'Others'];
  public barChartType = 'bar';
  public barChartLegend = true;

  public chartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  ];
  public lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
/*   public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
  }; */
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];



  public barChartColors: Array<any> = [
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
  barChartData: any[] = [{ data: [55, 60, 75, 82, 56, 62, 80], label: 'File Count' }];

  filterData = [{ id: 1, count: 20 }, { id: 2, count: 20 }, { id: 3, count: 40 }, { id: 4, count: 60 }, { id: 5, count: 70 }];
  ngOnInit() {
    // this.filterValues();
    // setInterval(() => {
    //   this.randomize();
    // }, 5000);
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
    this.barChartData = [];
    this.barChartData.push({ data: filterLineChartData, label: 'File Count' });
  }

  filterLineChartValues(data) {
    data.forEach(item => {
      this.formatNesterArrayList(item);
    });
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public randomize(): void {
    const randomData = [
      Math.round(Math.random() * 100),
      Math.round(Math.random() * 100),
      Math.round(Math.random() * 100),
      Math.random() * 100,
      Math.round(Math.random() * 100),
      Math.random() * 100,
      Math.round(Math.random() * 100)
    ];

    const temp = {
      data: randomData,
      label: 'Company A'
    };
    this.barChartData = [];
    this.barChartData.push(temp);
  }
}
