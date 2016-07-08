import React, { Component } from 'react';
import {
  ListView
} from 'react-native';
import InfiniteScrollView from 'react-native-infinite-scroll-view';

export default class MultiSelectDragDropListView extends Component {
    constructor(props) {
        super();
        var rowHasChangedFunc = props.rowHasChanged || {
            rowHasChanged: (r1, r2) => r1 !== r2
        }
        var ds = new ListView.DataSource(rowHasChangedFunc)
        this.state = {
            dataSource: ds.cloneWithRows(props.data)
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nextProps.data)
        })
    }
    render() {
        return (
            <ListView
                {...this.props}
                renderScrollComponent={props => <InfiniteScrollView {...props} />}
                dataSource={this.state.dataSource}
                enableEmptySections={true}
                canLoadMore={true}
            />
        )
    }
}
