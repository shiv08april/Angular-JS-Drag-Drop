import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { ConnectWebSocket } from '@ngxs/websocket-plugin';
import { Observable } from 'rxjs';
import { KafkaState } from './state/kafka.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  @Select(KafkaState.messages)
  kafkaMessages$: Observable<string[]>;

  @Select(KafkaState.messages)
  barchart$: Observable<string[]>;

  @Select(KafkaState.lineChartData)
  lineChartData: Observable<any[]>;

  value = ['[{"id":1,"count":0},{"id":2,"count":0},{"id":3,"count":0},{"id":4,"count":0},{"id":5,"count":2}]'];
  constructor(private store: Store) { }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    console.log('parsed', this.value.toString());
    this.store.dispatch(new ConnectWebSocket());


    // this.kafkaMessages$.subscribe(a => {
    //   console.log('a', a);
    // });

    //   this.barchart$.subscribe(a => {
    //     console.log('barChart$', a);
    //   });
    // }


  }
}
