import React from 'react';
import "./Playback.less"
import RvPage from "../../component/RvPage/RvPage";
import {message, Table} from "antd";
import {findChannels} from "../../service/channel";
import RvModal from "../../component/RvModal/RvModal";
import PlaybackPlay from "./PlaybackPlay";


export default class Playback extends React.Component {

    constructor(props) {
        super(props);
        //const that = this;
        this.state = {
            data: [],
            dataTotal: 0,
            page: 1,
            pageSize: 6,
        }
    }

    componentDidMount() {
        this.loadChanelsData()
    }

    loadChanelsData = (params) => {
        findChannels({
            page: this.state.page,
            pageSize: this.state.pageSize,
            enableMp4: 1,
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

    viewChannelVideoRecord = (channel) => {
        RvModal.open({
            width: 1120,
            title: `回看: ${channel.name}`,
            footer: null,
            onCancel: (args) => null,
        }, <PlaybackPlay channel={channel}/>)
    }

    deleteChannelVideoRecord = () => {
        message.info("暂未实现!!")
    }

    render() {


        return (
            <RvPage className={"home-page"}>
                <Table className={"playback-table"}
                       columns={[
                           {
                               title: '通道名称',
                               dataIndex: 'name',
                               key: 'name',
                           },
                           {
                               title: '虚拟主机Vhost',
                               dataIndex: 'vhost',
                               key: 'vhost',
                               width: 180
                           },
                           {
                               title: '应用标识App',
                               dataIndex: 'app',
                               key: 'app',
                               width: 160
                           },
                           {
                               title: '通道标识Stream',
                               key: 'stream',
                               dataIndex: 'stream',
                               width: 160
                           },
                           {
                               title: '操作',
                               key: 'action',
                               width: 200,
                               render: (text, record) => (
                                   <span>
                                       <a href="javascript:;" onClick={()=>this.viewChannelVideoRecord(record)}>查看录像</a>
                                       {/*<Divider type="vertical"/>
                                       <a href="javascript:;" onClick={this.deleteChannelVideoRecord}>删除</a>*/}
                                   </span>
                               ),
                           },
                       ]}
                       dataSource={this.state.data}
                       pagination={{
                           onChange: page => {
                               this.loadChanelsData({
                                   page: page,
                               })
                           },
                           current: this.state.page,
                           showQuickJumper: true,
                           total: this.state.dataTotal,
                           pageSize: this.state.pageSize,
                       }}
                />
            </RvPage>
        );
    }

    static propTypes = {}
    static defaultProps = {}
}
