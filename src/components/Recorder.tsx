import React from 'react';
import recordIcon from '../assets/img/record.png'
import stopIcon from '../assets/img/stop.png'
import startIcon from '../assets/img/start.png'
import * as colors from '../assets/constants/colors'

const MicRecorder = require('mic-recorder-to-mp3');
const Mp3Recorder = new MicRecorder({bitRate: 128});

enum RecordingStatus {
    START,
    RECORDED,
    STOP
}

interface RecorderState {
    recordingStatus: RecordingStatus,
    blobURL: string,
    isBlocked: boolean,
    description: string
}


const styles = {
    height: 100,
    padding: '5px 8px',
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: colors.blue,
    color: colors.white,
};


class Recorder extends React.Component<{}, RecorderState> {
    constructor(props: any) {
        super(props);
        this.state = {
            recordingStatus: RecordingStatus.START,
            blobURL: '',
            isBlocked: false,
            description: 'Click to record your voice!'
        };
    }

    start = () => {
        if (this.state.isBlocked) {
            console.log('Permission Denied');
        } else {
            Mp3Recorder
                .start()
                .then(() => {
                    this.setState({recordingStatus: RecordingStatus.STOP, description: 'Click to stop your voice!'});
                }).catch((e: string) => console.error(e));
        }
    };

    stop = () => {
        Mp3Recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]: any) => {
                const blobURL = URL.createObjectURL(blob)
                this.setState({blobURL: blobURL, recordingStatus: RecordingStatus.RECORDED, description: 'Click to play your voice!'});
            }).catch((e: string) => console.log(e));
    };

    play = () => {
        const player = new Audio(this.state.blobURL);
        player
            .play()
            .then(() => {
                this.setState({recordingStatus: RecordingStatus.START, description: 'Click to play your voice again!'});
            }).catch((e: string) => console.error(e));
    }

    componentDidMount() {
        let newNavigator: any;
        newNavigator = navigator
        newNavigator.getUserMedia({audio: true},
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
        switch (this.state.recordingStatus) {
            case RecordingStatus.START:
                return this.start();
            case RecordingStatus.STOP:
                return this.stop()
            case RecordingStatus.RECORDED:
                return this.play()
        }
    }

    getIcon = () => {
        switch (this.state.recordingStatus) {
            case RecordingStatus.START:
                return recordIcon
            case RecordingStatus.STOP:
                return stopIcon
            case RecordingStatus.RECORDED:
                return startIcon
        }
    }

    render() {
        let imageIcon = this.getIcon()
        return <div>
            <header className="App-header">
                <img style={styles} src={imageIcon} onClick={this.triggerRecord}/>
                <p>{this.state.description}</p>
            </header>
        </div>
    }
}

export default Recorder