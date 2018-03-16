import * as React from 'react';

type Props = {
  time: string,
  size: Number,
  price: Number,
  side: string,
  fills: Number
};
type State = {
  time: string,
  price: string,
};

export class Order extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);	

    // Format the date
    var date = new Date(props.time);
    var minutes = date.getMinutes();
    var minutest = this.pad(minutes, 2);
    var hours = date.getHours();
    var hourst = this.pad(hours, 2);
    var seconds = date.getSeconds();
    var secondst = this.pad(seconds, 2);
    var millis = date.getMilliseconds();
    var millist = this.pad(millis, 3);
    var formatedDate = `${hourst}:${minutest}:${secondst}.${millist}`;

    // Format the price
    var priceStr = props.price;
    var formatedPrice = priceStr.substring(0, priceStr.length - 6);

    this.state = {time: formatedDate, price: formatedPrice};
  }
  
  pad (num: Number, size: Number) {
    var s = num + '';
    while (s.length < size) {
      s = '0' + s;
    }
    return s;
  }
  
  render() {
    return (
        <tr className={this.props.side}>
          <td className="time">{this.state.time}</td>
          <td>{this.props.size}</td>
          <td>{this.state.price}</td>
		  <td>{this.props.fills}</td>
        </tr>
    );
  }
}