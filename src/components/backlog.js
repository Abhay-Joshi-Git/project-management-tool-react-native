import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import immutable from 'immutable';
import PMTstore, {modules} from 'project-management-tool-redux';
import { connect } from 'react-redux';
import MultiSelectDragDropListView from './multiSelectDragDropList.js';
import Issue from './issue.js';
import listStyle from './commonStyles/list.js';
import { IMG_DOWN_CARET } from '../images.js';
import appConst from '../constants.js';

class Backlog extends React.Component {
    constructor(props) {
        super();
        this._bindFunctions();
    }
    _bindFunctions() {
        this._loadMoreContentAsync = this._loadMoreContentAsync.bind(this);
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
                {this.getListViewUI()}                    
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
            <MultiSelectDragDropListView
                data={this.props.issues.toArray()}
                renderRow={this._renderRow}
                onLoadMoreAsync={this._loadMoreContentAsync}
            />
        )
    }
    _loadMoreContentAsync() {
        this.props.loadIssues({
            offset: this.props.issues.count(),
            qty: appConst.LOAD_BATCH_QTY
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
