'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import immutable from 'immutable';
import { iss } from './src/components/backlogList.js';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
var issues_list = [
                      {title: 'Create container for display', id: 's1',img_url:'./images/clearSelection_1.jpg',esti:3},
                      {title: 'Dashboard icons are not correct', id: 's2',img_url:'./images/clearSelection_1.jpg',esti:2},
                      {title: 'Provide bug icon ', id: 's3',img_url:'./images/clearSelection_1.jpg',esti:5}
                  ]

class projmgmt extends React.Component {

  constructor(props){
    super(props);
    this._onPressButton=this._onPressButton.bind(this);
  	this.state = {
    	dataSource: ds.cloneWithRows(iss.issues),
    }
  }

  _renderRow(rowData)
   {
  	return <View style={styles.rowstyle}>
                <View style={styles.view1}>
                            <Image style={styles.icon}
                                   source={require('./images/clearSelection_1.jpg')}/>
                            <Text style={styles.idstyle}>{rowData.id}</Text>
                            <View style={styles.roundball}>
                                <Text>{rowData.estimation}</Text>
                            </View>
                </View>
                <View style={styles.view2}>
                            <Text numberOfLines={1} style={{ fontSize:18}}>{rowData.summary}</Text>
                </View>
          </View>
  }
  _onPressButton(){
      console.log(issues_list);
  }
  render() {
    return (
      <View style={styles.container}>
      <View style={{flexDirection:'row'}}>
                <Text style={styles.heading}>Sprints</Text>
                <TouchableOpacity onPress={this._onPressButton}>
                <Image
                      style={styles.icon}
                      source={require('./images/CarrotDownArrowCurved_backgroundUpdated.png')}
                 />
                </TouchableOpacity>
      </View>

            <View style={styles.separator}/>
            <Text style={styles.heading}>Backlog</Text>
            <View style={styles.separator}/>
       	<ListView
      	 dataSource={this.state.dataSource}
      	 renderRow={ this._renderRow } />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',

  },
  rowstyle:{
      height:60,
      backgroundColor: '#F5FCFF',
      borderBottomWidth:1,
      borderBottomColor: 'black',
      flex:1,
},
view1:{
  justifyContent: 'flex-start' ,
  alignItems: 'flex-start',
  flexDirection:'row',
},
view2:{
  width:350,
  flex:1
},
  roundball:{
    width: 30,
    height: 25,
    borderRadius:10,
    backgroundColor: '#e9e9e9',
    alignItems:'center',
    justifyContent:'center',
  },
  separator: {
      height: 2,
      backgroundColor: 'black'
    },
    heading: {
      fontSize: 20,
      margin: 10,
      color: 'black',
      fontWeight: 'bold',
    },
    icon:{
      height:25,
      width:25,
      marginRight:50,
    },
    idstyle:{
      fontSize:25,
      marginRight:170,
    },

});

AppRegistry.registerComponent('projmgmt', () => projmgmt);
