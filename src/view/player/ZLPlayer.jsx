import React from 'react';
import "./ZLPlayer.less"
import {findChannelByVas} from "../../service/channel";
import queryString from 'query-string';
import Loader from "../../component/Loader";
import {Icon, Input, Radio, Tabs, Tooltip} from "antd";
import ReactPlayer, {GrindPlayer} from '../../component/ReactPlayer';
import hlsjs from 'hls.js';
import flvjs from 'flv.js';
import grindPlayerSwf from '../../component/ReactPlayer/GrindPlayer.swf';
import flashlsOSMFSwf from '../../component/ReactPlayer/flashlsOSMF.swf';
import UAParser from 'ua-parser-js';




export default class ZLPlayer extends React.Component {

    constructor(props) {
        super(props);
        //const that = this;
        this.state = {
            channelData: null,
            playBaseProps: {
                muted: true,
                videoProps: {
                    className: "zpplayer-player-video",

                },
                playerProps: {

                },
                onKernelError: () => {
                    console.log("onKernelError")
                },

            },


        }

    }

    componentDidMount() {
        const ua = UAParser(global.navigator.userAgent);


        let params = queryString.parse(this.props.location.search);


        this.setState({
            loading: true,
        }, () => {
            findChannelByVas(params.vhost, params.app, params.stream).then((res) => {
                this.setState({
                    channelData: res.data,
                    params: params,
                }, () => {
                    this.changePlayType("flvjs")
                })
            }).finally(() => {
                this.setState({
                    loading: false,
                })
            })
        })
    }

    changePlayType = (type) => {
        const {channelData} = this.state;
        if (type == "flvjs") {
            this.setState({
                playinfo: {
                    kernel: 'flvjs',
                    vtype: 'flvjs',
                    live: true,
                    src: channelData.play_addrs.flv,
                    type: 'video/x-flv',

                    config: {
                        enableStashBuffer: false,
                        stashInitialSize: 384
                    },
                }
            })
        } else if (type == "hlsjs") {
            this.setState({
                playinfo: {
                    kernel: 'hlsjs',
                    vtype: 'hlsjs',
                    live: true,
                    src: channelData.play_addrs.hls,
                    type: 'application/x-mpegURL',
                }

            })
        } else if (type == "flash_rtmp") {
            this.setState({
                playinfo: {
                    kernel: 'flash',
                    vtype: 'flash_rtmp',
                    live: true,
                    src: channelData.play_addrs.rtmp,
                    type: "rtmp/mp4",
                }
            })
        }

    }


    render() {
        const {channelData, params, playinfo, playBaseProps} = this.state;
        if (!this.state.channelData || !playinfo) {
            return <Loader spinning={true}/>
        }


        return (
            <div className={"zpplayer-wrapping"}>
                <div className={"zpplayer-header"}>
                    {channelData.name}
                </div>

                <div className={"zpplayer-content"}>

                    <div className={"zpplayer-video"}>

                        {'hlsjs' === playinfo.kernel && (
                            <ReactPlayer ref={(reactPlayer) => this.reactPlayer = reactPlayer} className={"zpplayer-player"} {...playinfo} {...playBaseProps} autoplay/>
                        )}
                        {'flvjs' === playinfo.kernel && (
                            <ReactPlayer ref={(reactPlayer) => this.reactPlayer = reactPlayer} className={"zpplayer-player"} {...playinfo} {...playBaseProps} autoplay/>
                        )}
                        {'flash' === playinfo.kernel && (
                            <ReactPlayer.GrindPlayer ref={(reactPlayer) => this.reactPlayer = reactPlayer} {...playinfo} grindPlayerSwf={grindPlayerSwf} flashlsOSMFSwf={flashlsOSMFSwf}/>
                        )}


                    </div>
                    <div className={"zpplayer-bottom"}>
                        <Tabs type="card"
                              className="zl-des-card-container"
                              tabBarExtraContent={
                                  <div style={{paddingRight: 3}}>
                                      <Radio.Group defaultValue={playinfo.vtype} buttonStyle="solid" onChange={(e) => {
                                          this.changePlayType(e.target.value)
                                      }}>
                                          <Radio.Button value="flvjs">FLV</Radio.Button>
                                          <Radio.Button value="flash_rtmp">RTMP</Radio.Button>
                                          <Tooltip title={!channelData.play_addrs.hls?"当前通道未开启HLS直播":null}>
                                            <Radio.Button value="hlsjs" disabled={!channelData.play_addrs.hls}>HLS</Radio.Button>
                                          </Tooltip>

                                      </Radio.Group>
                                  </div>

                              }>
                            <Tabs.TabPane tab="分享地址&视频源地址" key="1">
                                <div className={"zpplayer-bottom-tab-pane"}>
                                    <div>
                                        <div>分享地址：</div>
                                        <div><Input value={location.href} addonAfter={<Icon type="copy"/>}/></div>
                                    </div>
                                    <div>
                                        <div>iframe：</div>
                                        <div><Input value={`<iframe src="${location.href}&iframe=yes&aspect=640x360" width="640" height="360" allowfullscreen allow="autoplay"></iframe>`} addonAfter={<Icon type="copy"/>}/></div>
                                    </div>
                                    <div>
                                        <div>flv：</div>
                                        <div><Input value={channelData.play_addrs.flv} addonAfter={<Icon type="copy"/>}/></div>
                                    </div>
                                    <div>
                                        <div>rtsp：</div>
                                        <div><Input value={channelData.play_addrs.rtsp} addonAfter={<Icon type="copy"/>}/></div>
                                    </div>
                                    <div>
                                        <div>rtmp：</div>
                                        <div><Input value={channelData.play_addrs.rtmp} addonAfter={<Icon type="copy"/>}/></div>
                                    </div>
                                    <div>
                                        <div>hls：</div>
                                        <div><Input value={channelData.play_addrs.hls} addonAfter={<Icon type="copy"/>}/></div>
                                    </div>
                                </div>
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </div>

            </div>
        );
    }


    static contextTypes = {}
    static propTypes = {}
    static defaultProps = {}
}
