import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
    IMG_ISSUE_TYPE_STORY,
    IMG_ISSUE_TYPE_BUG,
    IMG_PRIO_HIGHEST,
    IMG_PRIO_HIGH,
    IMG_PRIO_MED,
    IMG_PRIO_LOW,
    IMG_DOWN_CARET
} from '../images.js';
import listStyle from './commonStyles/list.js';

export default class Issue extends Component {
    render() {
        var issue = this.props.issue;
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
                                <Text style={{fontWeight: 'bold'}}>
                                    {issue.get('estimation')}
                                </Text>
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
}

const styles = StyleSheet.create({
    ...listStyle,
    issueId: {
        fontSize: 20,
        color: '#095eef',
        fontWeight: 'bold',
        marginLeft: 2
    }
});
