import * as React from 'react';
var bigdecimal = require("bigdecimal");

export class DiffMeter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);	
	
	this.state = {buyPercent: 0};
  }
  
  componentWillReceiveProps(nextProps) {
	if(this.props.buys == nextProps.buys && this.props.sells == nextProps.sells) {
		return;
	}
	
	var buys = new bigdecimal.BigDecimal(nextProps.buys)
	var sells = new bigdecimal.BigDecimal(nextProps.sells)
	var total = buys.add(sells);
	
	if(total.compareTo(new bigdecimal.BigDecimal(0)) > 0)
	{	
      var down = bigdecimal.RoundingMode.DOWN();
      var percent = buys.divide(total, 3, down).multiply(new bigdecimal.BigDecimal(100)).intValue();
	  this.setState({buyPercent: percent});  
	}
  }

  render() {
    return (
	  <div className="diffmeter">
	    <div className="totalBuys">{this.props.buys}</div>
	    <div className="cumulativeDelta">{this.props.delta}</div>
	    <div className="totalSells">{this.props.sells}</div>
	    <svg width="100" height="10">
        <rect width="100" height="10" fill="orange" rx="0" ry="0"></rect>
        <rect width={this.state.buyPercent} height="10" fill="CornflowerBlue" rx="0" ry="0"></rect></svg>
	  </div>
	);
  }
}