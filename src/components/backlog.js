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
var styles = StyleSheet.create(listStyle);
var type_story=require('../../images/story.jpg');
var prio_highest=require('../../images/highest.jpg');
var prio_high=require('../../images/high.jpg');
var prio_med=require('../../images/medium.jpg');
var prio_low=require('../../images/lowest.jpg');
var type_bug=require('../../images/bug.jpg');

class Backlog extends React.Component {
    constructor(props) {
        super();
        this._setIssueType=this._setIssueType.bind(this);
        this._setPriority=this._setPriority.bind(this);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })

        this.state = {
            dataSource: ds.cloneWithRows(props.issues.toArray()),
            issues: [...props.issues.toArray()],
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nextProps.issues.toArray()),
            issues: [...nextProps.issues.toArray()]
        })
    }

    componentDidMount() {
        this._loadMoreContentAsync();
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.sprintContainer}>
                      <View style={styles.sprintLeft}>
                          <Text style={styles.headerText}>Sprint</Text>
                      </View>
                      <View style={styles.sprintRight}>
                          <TouchableOpacity>
                          <Image style={styles.icon}
                              source={require('../../images/CarrotDownArrowCurved_backgroundUpdated_white.png')}
                          />
                          </TouchableOpacity>
                      </View>
                </View>
                  <View style={styles.separator}/>
                  <Text style={styles.headerText}>Backlog</Text>
                  <View style={styles.separator}/>
                  <View style={styles.listViewContainer}>
                      {this._getIssuesList()}
                  </View>
            </View>
        );
    }
    _getIssuesList() {
        return (
            <ListView
                renderScrollComponent={props => <InfiniteScrollView {...props} />}
                dataSource={this.state.dataSource}
                renderRow={this._renderRow.bind(this)}
                enableEmptySections={true}
                canLoadMore={true}
                onLoadMoreAsync={this._loadMoreContentAsync.bind(this)}
            />
        )
    }
    _loadMoreContentAsync() {
        this.props.loadIssues({
            offset: this.state.issues.length,
            qty: 16
        })
        return Promise.resolve(true)
    }
    _setIssueType(issue){
        switch (issue.get('type')) {
          case 'story':return (<Image style={styles.icon} source={type_story}/>)
          break;
          case 'bug':return (<Image style={styles.icon} source={type_bug}/>)
          break;
            }
    }
    _setPriority(issue){
          switch (issue.get('priority')) {
            case 'highest':return (<Image style={styles.icon} source={prio_highest}/>)
              break;
            case 'high':return (<Image style={styles.icon} source={prio_high}/>)
                break;
            case 'medium':return (<Image style={styles.icon} source={prio_med}/>)
                  break;
            case 'low':return (<Image style={styles.icon} source={prio_low}/>)
                    break;
            }
        }
    _renderRow(issue) {
        return (
          <View key={issue.get('id')} style={styles.listItemCotainer}>
                  <View style={styles.leftContainer}>
                      <View style={styles.topContainer}>
                          <View style={styles.topLeft}>
                              {this._setIssueType(issue)}
                              {this._setPriority(issue)}
                              <Text style={{fontSize:20,color:'#095eef',fontWeight: 'bold',marginLeft:2}}>
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
                  <Image style={styles.icon}
                      source={require('../../images/CarrotDownArrowCurved_backgroundUpdated_white.png')}
                  />
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
