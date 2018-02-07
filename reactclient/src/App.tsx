import * as React from 'react';
import './App.css';
import { subscribeToTimer } from './api';
import { Tape } from './components/tape';

type Props = {};
type State = {};

class App extends React.Component<Props, State> {
  state = {
    timestamp: 'no timestamp yet'
  };

  constructor(props: Props) {
    super(props);
    subscribeToTimer((err: Error, timestamp: String) => this.setState({ 
      timestamp 
    }));
  }
  
  render() {
    return (
      <Tape />
    );
  }
}

export default App;
