import React from 'react';
import MicRecorder from "mic-recorder-to-mp3";
import recordIcon from '../assets/img/record.png'
import stopIcon from '../assets/img/stop.png'
import * as colors from '../assets/constants/colors'

const Mp3Recorder = new MicRecorder({bitRate: 128});


const styles = {
    height: 100,
    padding: '5px 8px',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: colors.blue,
    color: colors.white,
};

interface RecorderState {
    isRecording: boolean,
    blobURL: string,
    isBlocked: boolean
}
class Recorder extends React.Component<{}, RecorderState> {
    constructor(props) {
        super(props);
        this.state = {
            isRecording: false,
            blobURL: '',
            isBlocked: false,
        };
    }

    start = () => {
        if (this.state.isBlocked) {
            console.log('Permission Denied');
        } else {
            Mp3Recorder
                .start()
                .then(() => {
                    this.setState({isRecording: true});
                }).catch((e) => console.error(e));
        }
    };

    stop = () => {
        Mp3Recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                const blobURL = URL.createObjectURL(blob)
                this.setState({blobURL: blobURL, isRecording: false});
            }).catch((e) => console.log(e));
    };

    componentDidMount() {
        navigator.getUserMedia({audio: true},
            () => {
                console.log('Permission Granted');
                this.setState({isBlocked: false});
            },
            () => {
                console.log('Permission Denied');
                this.setState({isBlocked: true})
            },
        );
    }

    triggerRecord = () => {
        this.state.isRecording ? this.stop() : this.start()
    }

    render() {
        let imgStyle = this.state.isRecording ? stopIcon : recordIcon;
        return <div>
            <header className="App-header">
                <img style={styles} src={imgStyle} onClick={this.triggerRecord}/>
                <audio src={this.state.blobURL} controls="controls"/>
            </header>
        </div>
    }
}

export default Recorder