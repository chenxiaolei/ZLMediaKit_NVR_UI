import React from 'react';
import "./Home.less"
import {Redirect} from "react-router";

export default class Home extends React.Component {

    constructor(props) {
        super(props);
        //const that = this;
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {

        const {location} = this.props;
        return (
            <Redirect to={{pathname: '/plaza', state: {from: location}}}/>
        );
    }

    static propTypes = {}
    static defaultProps = {}
}
