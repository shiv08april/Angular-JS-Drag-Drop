export class AddMessageAction {
  static readonly type = '[Test] Add message';
  constructor(public message: string) { }
}
