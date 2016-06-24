import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView
} from 'react-native';
import PMTstore, {modules} from 'project-management-tool-redux';
import { connect } from 'react-redux';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import listStyle from './commonStyles/list.js';
import immutable from 'immutable';

class Backlog extends React.Component {

    constructor(props) {
        super();

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        })

        this.state = {
            dataSource: ds.cloneWithRows(props.issues.toArray()),
            issues: [...props.issues.toArray()]
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nextProps.issues.toArray()),
            issues: [...nextProps.issues.toArray()]
        })
    }

    componentDidMount() {
        this._loadMoreContentAsync()
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>
                    List of Issues
                </Text>
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

    _renderRow(issue) {
        return (
            <View key={issue.get('id')} style={styles.issueCotainer}>
                <Text>
                    id: {issue.get('id')}
                </Text>
                <Text>
                    summary: {issue.get('summary')}
                </Text>
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

var styles = StyleSheet.create(listStyle);
