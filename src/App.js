import React from 'react';
import './App.css';
import Recorder from './components/Recorder.tsx'

class App extends React.Component {


  render(){
    return (
        <div className="App">
            <Recorder/>
        </div>
    );
  }
}

export default App;
