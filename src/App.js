import React from 'react';
import './App.css';
import Recorder from './components/Recorder.tsx'

class App extends React.Component {


  render(){
    return (
        <div className="App">
            <header className="App-header">
                <h2>ENJOY RECORDING YOUR VOICE!</h2>
            </header>
            <Recorder/>
        </div>

    );
  }
}

export default App;
