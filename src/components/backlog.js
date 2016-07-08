import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableOpacity,
} from 'react-native';
import PMTstore, {modules} from 'project-management-tool-redux';
import { connect } from 'react-redux';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import listStyle from './commonStyles/list.js';
import immutable from 'immutable';
import {
    IMG_ISSUE_TYPE_STORY,
    IMG_ISSUE_TYPE_BUG,
    IMG_PRIO_HIGHEST,
    IMG_PRIO_HIGH,
    IMG_PRIO_MED,
    IMG_PRIO_LOW,
    IMG_DOWN_CARET
} from '../images.js';

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
        this._getIssueTypeUI = this._getIssueTypeUI.bind(this);
        this._getPriorityUI = this._getPriorityUI.bind(this);
        this._renderRow = this._renderRow.bind(this);
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
                    {this._getIssuesList()}
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
    _getIssuesList() {
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
    _getIssueTypeUI(issue){
        switch (issue.get('type')) {
            case 'story':
                return (<Image style={styles.icon} source={IMG_ISSUE_TYPE_STORY}/>)
            case 'bug':
                return (<Image style={styles.icon} source={IMG_ISSUE_TYPE_BUG}/>)
        }
    }
    _getPriorityUI(issue){
        switch (issue.get('priority')) {
            case 'highest':
                return (<Image style={styles.icon} source={IMG_PRIO_HIGHEST}/>)
            case 'high':
                return (<Image style={styles.icon} source={IMG_PRIO_HIGH}/>)
            case 'medium':
                return (<Image style={styles.icon} source={IMG_PRIO_MED}/>)
            case 'low':
                return (<Image style={styles.icon} source={IMG_PRIO_LOW}/>)
        }
    }
    _renderRow(issue) {
        return (
          <View key={issue.get('id')} style={styles.listItemCotainer}>
                  <View style={styles.leftContainer}>
                      <View style={styles.topContainer}>
                          <View style={styles.topLeft}>
                              {this._getIssueTypeUI(issue)}
                              {this._getPriorityUI(issue)}
                              <Text style={styles.issueId}>
                              {issue.get('id')}
                              </Text>
                          </View>
                          <View style={styles.topRight}>
                          <View style={styles.ellipse}>
                                      <Text style={{fontWeight: 'bold'}}>{issue.get('estimation')}</Text>
                          </View>
                          </View>
                      </View>
                      <View style={styles.bottomContainer}>
                      <Text numberOfLines={2} style={styles.summaryText}>
                            {issue.get('summary')}
                      </Text>
                      </View>
                  </View>
                  <View style={styles.rightContainer}>
                      <TouchableOpacity>
                          <Image style={styles.icon}
                              source={IMG_DOWN_CARET}
                          />
                      </TouchableOpacity>
                  </View>
            </View>
          )
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

const styles = StyleSheet.create({
    ...listStyle,
    issueId: {
        fontSize: 20,
        color: '#095eef',
        fontWeight: 'bold',
        marginLeft: 2
    }
});
