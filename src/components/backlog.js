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
import { imgsrc } from '/home/synerzip/project-management-tool-react-native/src/components/setimagesource.js';
var styles = StyleSheet.create(listStyle);

class Backlog extends React.Component {

    constructor(props) {
        super();

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
            <View style={{  flexDirection:'row',alignItems:'center'}}>
                  <Text style={styles.headerText}>Sprints</Text>
                  <TouchableOpacity>
                  <Image style={styles.icon}
                      source={require('/home/synerzip/project-management-tool-react-native/images/CarrotDownArrowCurved_backgroundUpdated.png')}
                  />
                  </TouchableOpacity>
                  </View>
                  <Text style={styles.headerText}>Backlog</Text>
                  <View style={styles.listViewContainer}>
                      {this._getIssuesList()}
                  </View>
            </View>
        );
    }
// sprintPress(){
//       return(
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//           <Select
//             width={250}
//             ref="sel"
//             optionListRef={() => this.ref['olist']}>
//             {
//               sprintlist.map((item) => <Option>{item.sprint_name}</Option>)
//             }
//           </Select>
//           <OptionList ref="olist"/>
//         </View>
//       )
// }
getSprintList(){
  return (
      <ListView
          renderScrollComponent={props => <InfiniteScrollView {...props} />}
          dataSource={this.state.dataSource1}
          renderRow={this._renderRow1}
          enableEmptySections={true}
          canLoadMore={true}
          onLoadMoreAsync={this._loadMoreContentAsync.bind(this)}
      />
  )
}
_renderRow1(Sprints){

}
    _getIssuesList() {
        return (
            <ListView
                renderScrollComponent={props => <InfiniteScrollView {...props} />}
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
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
    // setImageSource(){
    //   if(issue.get('priority') === 'high'){
    //     imgsrc=require('../../images/clearSelection_1.jpg');
    //   }
    //   else {
    //     imgsrc=require('../../images/issueImage.png');
    //   }
    //   return imgsrc
    // }

    _renderRow(issue) {
        return (
            <View key={issue.get('id')} style={styles.listItemCotainer}>
                <View style={styles.view1}>
                      <Image style={styles.icon}
                      source={require('/home/synerzip/project-management-tool-react-native/images/clearSelection_1.jpg')}/>
                      <Image style={styles.icon}
                      source={imgsrc}/>
                      <View style={styles.roundball}>
                                <Text>{issue.get('estimation')}</Text>
                        </View>
                      <Text style={{fontSize:15}}>
                          {issue.get('id')}
                      </Text>
                </View>
                <View style={styles.view2}>
                      <Text numberOfLines={1}
                            style={{justifyContent:'flex-end',fontSize:15}}>
                          {issue.get('summary')}
                      </Text>
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
