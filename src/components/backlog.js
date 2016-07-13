import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ToolbarAndroid,
} from 'react-native';
import immutable from 'immutable';
import PMTstore, {modules} from 'project-management-tool-redux';
import { connect } from 'react-redux';
import MultiSelectDragDropListView from './multiSelectDragDropList.js';
import Issue from './issue.js';
import listStyle from './commonStyles/list.js';
import { IMG_DOWN_CARET } from '../images.js';
import appConst from '../constants.js';
import { ColoredFab , MKTheme } from './commonStyles/list.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as MK from 'react-native-material-kit';

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
                {this._getToolbarUI()}
                {this._getSprintContainerUI()}
                <View style={styles.separator}/>
                {this._getBacklogHeaderUI()}
                <View style={styles.separator}/>
                <View style={styles.listViewContainer}>
                    {this.getListViewUI()}
                    {this._getFAB()}
                </View>
            </View>
        );
    }
    _getToolbarUI(){
      return(
        <View style={styles.iconContainer}>
              <View style={styles.toolbarMenu}>
                    <Icon name="bars" size={30} color='white'/>
               </View>
               <View style={styles.toolbarTitle}>
                    <Text style={{fontSize:30,color:'white'}}>Backlog</Text>
               </View>
               <View style={styles.toolbarActions}>
                    <Icon name="search" size={25} color='white' style={{marginRight:20}}/>
                    <Icon name="ellipsis-v" size={25} color='white'/>
               </View>
        </View>
      )
    }
    _getSprintContainerUI() {
        return (
            <View style={styles.sprintContainer}>
                  <View style={styles.sprintLeft}>
                      <Text style={styles.headerText}>Sprints</Text>
                  </View>
                  <View style={styles.sprintCenter}>
                        <Text> 8 issues</Text>
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
          <View style={styles.backlogContainer}>
              <View style={styles.backlogLeft}>
                       <Text style={styles.headerText}>Backlog</Text>
              </View>
              <View style={styles.backlogRight}>
                        <Text> {this.props.issues.count()} issues</Text>
              </View>
          </View>
        )
    }
    _getFAB(){
      return(
        <ColoredFab style={styles.footerFab}>
               <Icon
                   name='plus'
                   size={30}
                   color='white'
               />
        </ColoredFab>
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
