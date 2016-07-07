import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';
import immutable from 'immutable';
import PMTstore, {modules} from 'project-management-tool-redux';
import { connect } from 'react-redux';
import Backlog from 'backlog.js';


class SetImage extends React.Component{
  constructor(props){
    super();
    this.state={
      issues: [...props.issues.toArray()],
    }
  }

  componentWillReceiveProps(nextProps) {
      this.setState({
          issues: [...nextProps.issues.toArray()]
      })
  }
  render(){
    var imgsrc;
    return(
      <View>
        <View>
          {if (issues.get('priority') === 'high') {
              imgsrc=require('../../images/clearSelection_1.jpg');
              }
              else {
                imgsrc=require('../../images/clearSelection_1.jpg');
              }
          }
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

export default connect(mapStateToProps)(SetImage);

export imgsrc;
