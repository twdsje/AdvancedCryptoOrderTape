import * as React from 'react';
import { subscribeToTimer } from '../api';
import { Order } from './order';
var bigdecimal = require("bigdecimal");

type TapeProps = {};
type TapeState = {
  orders: TradeMessage[],
  minSize: Number,
  totalBuys: string,
  totalSells: string,
  cumulativeDelta: string
};

type TradeMessage = {
    productId: string;
    side: string;
    trade_id: string;
    price: number;
    size: string;
    time: string;
    sequence: number;
	fills: number;
};

export class Tape extends React.Component<TapeProps, TapeState> {
  constructor(props: TapeProps) {
    super(props);
    let initialArray: TradeMessage[] = [];
    this.state = {orders: initialArray, minSize: 0, totalBuys: "0.0", totalSells: "0.0", cumulativeDelta: "0.0"};
    subscribeToTimer((err: Error, input: TradeMessage) => this.addRow(input));

    this.minSizeChange = this.minSizeChange.bind(this);
  }

  addRow(msg: event) {
	let input: TradeMessage = JSON.parse(msg.data);
	
	if(input.type != "match")
	{
		return;
	}
	
	
	var size = new bigdecimal.BigDecimal(input.size);
	let orders: TradeMessage[] = this.state.orders;
	
	if(orders.length > 0 && input.time === orders[0].time && input.side === orders[0].side)
	{
		var block = new bigdecimal.BigDecimal(orders[0].size);
		block = block.add(size);
		orders[0].size = block.toString();
	    orders[0].fills = orders[0].fills + 1;
	}
	else
	{
      input.fills = 1;		
      orders.unshift(input);
      if (orders.length > 1000) {
        orders.pop();
      }
	}
	
	if(input.side === 'sell')
	{
      var num = size.add(new bigdecimal.BigDecimal(this.state.totalBuys));
	  var cum = bigdecimal.BigDecimal(this.state.cumulativeDelta).add(size);
	  this.setState({totalBuys : num.toString(), cumulativeDelta : cum.toString()});
	}
	else if (input.side === 'buy')
	{
	  var num = size.add(new bigdecimal.BigDecimal(this.state.totalSells));
	  var cum = bigdecimal.BigDecimal(this.state.cumulativeDelta).subtract(size);
	  this.setState({totalSells : num.toString(), cumulativeDelta : cum.toString()});
	}
	
	this.setState({orders: orders});
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
	  <div className="powerbar">
	    <div className="totalBuys">{this.state.totalBuys}</div>
		<div className="cumulativeDelta">{this.state.cumulativeDelta}</div>
		<div className="totalSells">{this.state.totalSells}</div>
	  </div>
      <table>
        <thead>
        <tr>
          <td>Time</td>
          <td>Size</td>
          <td>Price</td>
		  <td>Fills</td>
        </tr>
        </thead>
        <tbody>
          {this.state.orders.filter(e => e.size > this.state.minSize).map((order) => 
            <Order key={order.trade_id} time={order.time} size={order.size} price={order.price} side={order.side} fills={order.fills} />
          )}
        </tbody>
      </table>
      </div>
    );
  }
}