import React from 'react';
import "./Channel.less"
import RvPage from "../../component/RvPage/RvPage";
import {Button, Card, Icon, List, Switch, message} from "antd";
import {deleteChannel, findChannels, modifyChannel} from "../../service/channel";
import classnames from 'classnames';
import RvModal from "../../component/RvModal/RvModal";
import ChannelForm from "./ChannelForm";


export default class Channel extends React.Component {

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

    deleteChannelData = (channel) => {
        deleteChannel(channel.id).then(res => {
            message.success('删除『' + channel.name + '』成功!');
            this.loadChanelsData()
        })
    }

    toggleChannelActive = (channel, checked) => {
        const {id, active, ...rest} = channel;
        modifyChannel(id, {
            ...rest,
            active: checked ? 1 : 0
        }).then(res => {
            message.success('配置『' + channel.name + '』成功!');
            this.loadChanelsData()
        })
    }

    render() {
        return (
            <RvPage className={"home-page"} headerTools={
                <div>
                    <Button icon={"plus"} type="primary" onClick={() => {
                        RvModal.open({
                            width: 950,
                            title: `添加通道配置`,
                            footer: null,
                            onCancel: (args) => args.refresh && this.loadChanelsData(),
                        }, <ChannelForm mode="create"/>)
                    }}>添加通道</Button>
                </div>
            }>
                <List
                    className={"channel-config-panellist"}
                    grid={{ gutter: 16, column: 2 }}
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
                    dataSource={this.state.data}
                    renderItem={(item) => (
                        <List.Item>
                            <Card title={item.name} className={classnames("channel-config-panel", {"active": item.active == 1})}
                                  extra={
                                      <div>
                                          <Switch className={"channel-config-active-switch"} size={"default"} checkedChildren="启用" unCheckedChildren="关闭" checked={item.active == 1}
                                                  onChange={(checked) => this.toggleChannelActive(item, checked)}/>
                                          <Button className={"channel-config-btn channel-config-del-btn"} size={"default"} icon={"delete"} type="danger" ghost onClick={() => {
                                              RvModal.deleteConfirm(item.name, {
                                                  title: '您确定要删除此通道吗?',
                                                  onOk: () => {
                                                      this.deleteChannelData(item);
                                                  }
                                              });
                                          }}/>
                                          <Button className={"channel-config-btn channel-config-edit-btn"} size={"default"} icon={"setting"} type="primary" onClick={() => {
                                              RvModal.open({
                                                  width: 950,
                                                  title: `通道配置`,
                                                  footer: null,
                                                  onCancel: (args) => args.refresh && this.loadChanelsData(),
                                              }, <ChannelForm mode="edit" id={item.id}/>)
                                          }}/>

                                      </div>
                                  }>
                                <div className={"channel-config-view-panel-inner"}>
                                    <div>
                                        <div>虚拟主机Vhost</div>
                                        <div>{item.vhost}</div>
                                    </div>
                                    <div>
                                        <div>应用标识App</div>
                                        <div>{item.app}</div>
                                    </div>
                                    <div>
                                        <div>通道标识Stream</div>
                                        <div>{item.stream}</div>
                                    </div>
                                    <div>
                                        <div>接入地址</div>
                                        <div>{item.source_url}</div>
                                    </div>
                                    <div>
                                        <div>HLS直播</div>
                                        <div>{item.enable_hls ? <span className={"c-enable"}>已开启</span> : <span className={"c-disable"}>已关闭</span>}</div>
                                    </div>
                                    <div>
                                        <div>按需直播</div>
                                        <div>{item.on_demand ? <span className={"c-enable"}>已开启</span> : <span className={"c-disable"}>已关闭</span>}</div>
                                    </div>
                                    <div>
                                        <div>录像</div>
                                        <div>
                                            {
                                                item.record_mp4 ?
                                                    <>
                                                        <span className={"c-enable"}>已开启</span>
                                                        <span className={"max-keep-record-days-lable"}>保留{item.record_mp4}天</span>
                                                    </>
                                                    :
                                                    <span className={"c-disable"}>已关闭</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />

            </RvPage>
        );
    }

    static propTypes = {}
    static defaultProps = {}
}
