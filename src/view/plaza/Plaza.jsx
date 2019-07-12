import React from 'react';
import "./Plaza.less"
import RvPage from "../../component/RvPage/RvPage";
import {findChannels} from "../../service/channel";
import {List} from "antd";
import {apiDomin} from "../../config/apiconfig";
import RvImage from "../../component/RvImage/RvImage";
import black from "../../style/black.png"


export default class Plaza extends React.Component {

    constructor(props) {
        super(props);
        //const that = this;
        this.state = {
            data: [],
            dataTotal: 0,
            page: 1,
            pageSize: 99999,
        }
    }

    componentDidMount() {
        this.loadChanelsData()
    }

    loadChanelsData = (params) => {
        findChannels({
            page: this.state.page,
            pageSize: this.state.pageSize,
            active: 1,
            ...params
        }).then(res => {
            this.setState({
                data: res.data,
                dataTotal: res.total,
                page: res.page,
                pageSize: res.pageSize,
            })
        })
    }

    render() {
        return (
            <RvPage className={"home-page"} noHeader={true}>
                <List
                    className={"channel-py-list"}

                    pagination={false}
                    dataSource={this.state.data}
                    renderItem={(item) => {

                        let snapshotPath = `${apiDomin}/snapshot/`;
                        if (item.vhost && item.vhost != "__defaultVhost__") {
                            snapshotPath += item.vhost;
                        }
                        snapshotPath += "/"+ item.app+"/"+item.stream+".png"

                        return (
                            <List.Item className={"channel-py"}>
                                <div className={"channel-py-snap"} onClick={()=>{
                                    const w=window.open('about:blank');
                                    w.location.href=`/play?vhost=${item.vhost}&app=${item.app}&stream=${item.stream}`;
                                }}>
                                    <RvImage src={snapshotPath} fallbackSrc={black}/>
                                </div>
                                <div className={"channel-py-des"}>
                                    <span>{item.name}</span>
                                    {/*<span>在线</span>*/}
                                </div>
                            </List.Item>
                        )
                    }}
                />
            </RvPage>
        );
    }

    static propTypes = {}
    static defaultProps = {}
}
