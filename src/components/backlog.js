import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableOpacity,
} from 'react-native';
import immutable from 'immutable';
import PMTstore, {modules} from 'project-management-tool-redux';
import { connect } from 'react-redux';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import Issue from './issue.js';
import listStyle from './commonStyles/list.js';
import { IMG_DOWN_CARET } from '../images.js';

class Backlog extends React.Component {
    constructor(props) {
        super();
        this._bindFunctions();
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })
        this.state = {
            dataSource: ds.cloneWithRows(props.issues.toArray())
        }
    }
    _bindFunctions() {
        this._loadMoreContentAsync = this._loadMoreContentAsync.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nextProps.issues.toArray())
        })
    }
    componentDidMount() {
        this._loadMoreContentAsync();
    }
    render() {
        return (
            <View style={styles.container}>
                {this._getSprintContainerUI()}
                <View style={styles.separator}/>
                {this._getBacklogHeaderUI()}
                <View style={styles.separator}/>
                <View style={styles.listViewContainer}>
                    {this.getListViewUI()}
                </View>
            </View>
        );
    }
    _getSprintContainerUI() {
        return (
            <View style={styles.headerContainer}>
                  <View style={styles.sprintLeft}>
                      <Text style={styles.headerText}>Sprint</Text>
                  </View>
                  <View style={styles.sprintRight}>
                      <TouchableOpacity>
                          <Image style={styles.icon}
                              source={IMG_DOWN_CARET}
                          />
                      </TouchableOpacity>
                  </View>
            </View>
        )
    }
    _getBacklogHeaderUI() {
        return (
            <View style={styles.headerContainer}>
                  <View style={styles.sprintLeft}>
                      <Text style={styles.headerText}>Backlog</Text>
                  </View>
            </View>
        )
    }
    getListViewUI() {
        return (
            <ListView
                renderScrollComponent={props => <InfiniteScrollView {...props} />}
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
                enableEmptySections={true}
                canLoadMore={true}
                onLoadMoreAsync={this._loadMoreContentAsync}
            />
        )
    }
    _loadMoreContentAsync() {
        this.props.loadIssues({
            offset: this.props.issues.count(),
            qty: 16
        })
        return Promise.resolve(true)
    }
    _renderRow(issue) {
        return <Issue issue={issue} />
    }
}

const mapStateToProps = (state) => {
    return {
        issues: state.get('issues')
    }
}

export default connect(
    mapStateToProps,
    {loadIssues: modules.issues.loadIssues}
)(Backlog);

const styles = StyleSheet.create(listStyle);
