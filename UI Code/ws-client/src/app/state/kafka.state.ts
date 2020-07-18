import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AddMessageAction } from './kafka.actions';

export class KafkaStateModel {
  public messages: any;
  public barChartData: any[];
  public lineChartData: any[];
}

@State<KafkaStateModel>({
  name: 'kafka',
  defaults: {
    messages: [],
    barChartData: [],
    lineChartData: []
  }
})
export class KafkaState {
  @Selector()
  static barData(state: KafkaStateModel): string[] {
    console.log('messages ::::', state);
    const message = JSON.parse(state.messages);
    state.barChartData[0].data = message.map(item => {
      return item.count;
    });
    console.log(state.barChartData);
    return state.barChartData;
  }


  @Selector()
  static lineChartData(state: KafkaStateModel) {
    console.log('messages ::::', state.messages);
    const x = state.messages;
    const convertToStringMessage = x.toString();
    console.log('yu', convertToStringMessage);
    return convertToStringMessage;
    // const message = JSON.parse(state.messages);
    // console.log('message ::::', message);
  }

  @Selector()
  static messages(state: KafkaStateModel): string[] {
    const parsedMessages = state.messages;
    return parsedMessages;
  }

  @Action(AddMessageAction)
  add(ctx: StateContext<KafkaStateModel>, action: AddMessageAction) {
    const state = ctx.getState();
    const parsed = state.messages;
    // tslint:disable-next-line:max-line-length
    ctx.setState({ messages: [...state.messages, action.message], barChartData: [...state.barChartData], lineChartData: [...state.messages] });
  }
}
