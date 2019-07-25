import React from 'react';
import {Button, Input} from "antd";
import RvForm from "../../component/RvForm/RvForm";
import {findChannels} from "../../service/channel";

import {UnControlled as CodeMirror} from 'react-codemirror2'



import "./BatchChannelForm.less"
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/solarized.css';

import 'codemirror/mode/javascript/javascript'

import jsonlint from 'jsonlint-mod'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'
window.jsonlint = jsonlint


@RvForm.create()
export default class BatchChannelForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            formData: {},
            fields: [
                {
                    label: 'data',
                    name: 'data',
                    option: {
                        rules: [{
                            required: true,
                        },]
                    },
                    comp: <CodeMirror
                        editorDidMount={editor => { this.editor = editor }}
                        options={{
                            mode: 'application/json',
                            lint: true,
                            gutters: ['CodeMirror-lint-markers'],
                            theme: 'solarized dark',
                            lineNumbers: true
                        }}
                        onBeforeChange={(editor, data, value) => {
                            console.log("onBeforeChange fresh")
                            console.log(JSON.stringify(data));
                            console.log(JSON.stringify(value));
                        }}
                    />,
                }
            ]
        }
    }

    componentDidMount() {
        this.editor.setSize('100%', "400px");
        this.setState({
            loading: true,
        })
        findChannels({
            page: 1,
            pageSize: 99999,
        }).then((res) => {
            this.setState({
                formData: {
                    data: JSON.stringify(res.data,null, 4),
                },
            })
        }).finally(() => {
            this.setState({
                loading: false,
            })
        })

    }


    handleEditSubmit = (values) => {

    }

    closeModalIfExist = (args) => {
        if (this.props.closeWrappingModal)
            this.props.closeWrappingModal(args);
    }

    render() {
        const {fields, loading, formData} = this.state;
        const items = RvForm.Item.transform(fields, "edit", formData);

        return (
            <RvForm
                className={"batch-channel-form"}
                footer={<div>
                    <Button type="primary" htmlType="submit">保存</Button>
                    <Button onClick={this.closeModalIfExist}>放弃</Button>
                </div>}
                loading={loading}
                onEditSubmit={this.handleEditSubmit}
                onCreateSubmit={this.handleEditSubmit}
                itemLayout={{
                    labelCol: {
                        xs: {span: 0},
                        sm: {span: 0},
                    },
                    wrapperCol: {
                        xs: {span: 24},
                        sm: {span: 24},
                    },
                }}
                {...this.props}>

                {items}
            </RvForm>
        );
    }


}
