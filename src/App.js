import * as React from 'react';
import { subscribeToTimer } from './api';
import { Tape } from './components/tape';
import './App.css';

class App extends React.Component {
  state = {
    timestamp: 'no timestamp yet'
  };
  
  render() {
    return (
      <Tape />
    );
  }
}

export default App;
