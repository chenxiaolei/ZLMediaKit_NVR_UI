import React from 'react';

import moment from "moment";
import "./Playback.less"
import TimeSlider2 from "../../component/PlaybackTimeSlider/TimeSlider2";
import ReactPlayer from "../../component/ReactPlayer";
import {Calendar} from "antd";
import {findChannelRecordDaily, findChannelRecordMonthly} from "../../service/channel";


export default class PlaybackPlay extends React.Component {

    constructor(props) {
        super(props);
        //const that = this;
        this.state = {
            calValue: moment(),
            disabledDates: [],

            playTimestamp: null,
            recordMonthly: null,
            recordDaily: null,

            playSrcIdx: null,
            playbackRate: 1,
            playinfo: {
                kernel: 'flvjs',
                live: false,
                type: 'video/mp4',
                config: {
                    flvType: "mp4",
                    enableStashBuffer: false,
                    stashInitialSize: 384
                },
            }
        }

    }

    calDisabledDateFuc = (date) => {
        const {recordMonthly} = this.state;
        if (recordMonthly && recordMonthly.flagArr) {
            return recordMonthly.flagArr[date.date() - 1] === "0";
        }
        return true;
    }


    componentDidMount() {
        this.loadChannelRecord();
    }


    loadChannelRecord = () => {
        this.loadChannelRecordMonthly();
        this.loadChannelRecordDaily();
    }


    loadChannelRecordMonthly = () => {
        const {channel} = this.props;
        findChannelRecordMonthly(channel.vhost, channel.app, channel.stream, this.state.calValue.format("YYYYMM")).then(res => {
            if (res.code == 0) {
                this.setState({
                    recordMonthly: {
                        ...res.data,
                        flagArr: Array.from(res.data.flag)
                    }
                })
            }
        })

    }

    loadChannelRecordDaily = () => {
        const {channel} = this.props;
        findChannelRecordDaily(channel.vhost, channel.app, channel.stream, this.state.calValue.format("YYYYMMDD")).then(res => {
            if (res.code == 0) {
                this.setState({
                    playSrcIdx: res.data && res.data.list && res.data.list.length > 0 ? 50 : null,
                    recordDaily: {
                        ...res.data,
                        list: res.data && res.data.list ? res.data.list.map((record, recordIndex) => {

                            const beginTime = moment(record.startAt, "YYYYMMDDHHmmss")
                            const endTime = moment(beginTime).add(record.duration, "seconds");

                            return {
                                ...record,
                                beginTime: beginTime.valueOf(),
                                endTime: endTime.valueOf(),
                                style: {
                                    background: "rgba(14,255,0,0.49)"
                                },
                                idx: recordIndex,
                            }
                        }):[]
                    }
                })
            }
        })
    }


    handleCalendarSelect = (date) => {
        this.setState({
            calValue: date
        }, () => {
            this.loadChannelRecord();
        })
    }

    handlePlayerEnded = () => {
        const {recordDaily, playSrcIdx} = this.state;
        console.log("播完了:", playSrcIdx, recordDaily.list[playSrcIdx].mp4Full)

        if (playSrcIdx + 1 < recordDaily.list.length) {
            this.setState({
                playSrcIdx: playSrcIdx + 1
            })
        }
    }

    handlePlayerPlay = () => {
        const {playbackRate} = this.state;
        this.reactPlayer && this.reactPlayer.setPlaybackRate(playbackRate);
    }

    handlePlayeTimeUpdate = (e) => {
        const {recordDaily, playSrcIdx, playTimestamp} = this.state;
        recordDaily.list[playSrcIdx].beginTime;
        this.setState({
            playTimestamp: recordDaily.list[playSrcIdx].beginTime + (e.target.currentTime * 1000)
        })
    }

    handlePlaybackRateChange = (e) => {
        const playbackRate = e.target.playbackRate;
        this.setState({
            playbackRate
        }, () => {
            this.reactPlayer && this.reactPlayer.setPlaybackRate(playbackRate);
        })
    }

    render() {
        const {recordDaily, playinfo, calValue, playSrcIdx, playTimestamp} = this.state;

        console.log("recordDaily.list[playSrcIdx].mp4Full", playSrcIdx, recordDaily && recordDaily.list && recordDaily.list.length > 0 && recordDaily.list[playSrcIdx] && recordDaily.list[playSrcIdx].mp4)
        return (
            <div className={"playback-play-container"}>

                <div className={"playback-play-header"}>
                    <div className={"playback-player"}>
                        {
                            playSrcIdx != null && recordDaily && recordDaily.list && recordDaily.list.length > 0 && recordDaily.list[playSrcIdx] &&
                            <ReactPlayer
                                ref={(reactPlayer) => this.reactPlayer = reactPlayer}
                                className={"playback-zpplayer-player"}
                                {...playinfo}
                                src={recordDaily.list[playSrcIdx].mp4Full}
                                onRateChange={this.handlePlaybackRateChange}
                                onEnded={this.handlePlayerEnded}
                                onPlay={this.handlePlayerPlay}
                                onTimeUpdate={this.handlePlayeTimeUpdate}
                                autoplay/>
                        }

                    </div>
                    <div className={"playback-calendar"}>
                        <Calendar fullscreen={false}
                                  value={calValue}
                                  onChange={this.handleCalendarSelect}
                                  disabledDate={this.calDisabledDateFuc}
                        />
                    </div>
                </div>

                <div className={"playback-play-bottom"}>
                    <TimeSlider2
                        minTimestamp={moment(calValue).startOf('day').valueOf()}
                        maxTimestamp={moment(calValue).add(1, "day").startOf('day').valueOf()}
                        playTimestamp={playTimestamp ? playTimestamp : moment(calValue).startOf('day').valueOf()}
                        playTimestampChange={(time, recordInfo, playOffset) => {
                            console.log("changeMp4:", time, recordInfo)
                            this.setState({
                                playSrcIdx: recordInfo ? recordInfo.idx : null,
                                playTimestamp: time
                            }, () => {
                                if (playOffset && this.reactPlayer)
                                    this.reactPlayer.setCurrentTime(playOffset / 1000);
                            })

                        }}
                        timecell={recordDaily && recordDaily.list ? recordDaily.list : []}/>

                </div>
            </div>
        );
    }


    static contextTypes = {}
    static propTypes = {}
    static defaultProps = {}
}
