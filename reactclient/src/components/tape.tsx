import * as React from 'react';
import { subscribeToTimer } from '../api';
import { Order } from './order';

type TapeProps = {};
type TapeState = {
  orders: TradeMessage[],
  minSize: Number
};

type TradeMessage = {
    productId: string;
    side: string;
    tradeId: string;
    price: number;
    size: number;
    time: string;
    sequence: number;
};

export class Tape extends React.Component<TapeProps, TapeState> {
  constructor(props: TapeProps) {
    super(props);
    let initialArray: TradeMessage[] = [];
    this.state = {orders: initialArray, minSize: 0};
    subscribeToTimer((err: Error, input: TradeMessage) => this.addRow(input));

    this.minSizeChange = this.minSizeChange.bind(this);
  }

  addRow(input: TradeMessage) {
    if (input.size > this.state.minSize) {
      let orders: TradeMessage[] = this.state.orders;
      orders.unshift(input);
      if (orders.length > 100) {
        orders.pop();
      }
      this.setState({orders: orders});
    }
  }
  
  minSizeChange(e: React.FormEvent<HTMLInputElement>) {
    var num = parseFloat(e.currentTarget.value);
    this.setState({minSize: num});
  }
  
  render() {
    return (
      <div className="tape">
      <div className="controls">
        <label>Min Size</label><input type="text" onChange={this.minSizeChange} />
      </div>
      <table>
        <thead>
        <tr>
          <td>Time</td>
          <td>Size</td>
          <td>Price</td>
        </tr>
        </thead>
        <tbody>
          {this.state.orders.map((order) => 
            <Order key={order.tradeId} time={order.time} size={order.size} price={order.price} side={order.side} />
          )}
        </tbody>
      </table>
      </div>
    );
  }
}