import React, { Component } from 'react';
import {
  ListView,
  StyleSheet,
  Text,
  Dimensions,
  View,
  PanResponder,
  Animated,
  TouchableHighlight
} from 'react-native';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
//one of the sources for assign has an enumerable key on the prototype chain react-native
//https://github.com/facebook/react-native/issues/5507

import reactMixin from 'react-mixin';
import timerMixin from 'react-timer-mixin';
import _ from 'lodash';
import listStyle from './commonStyles/list.js';
import NativeMethodsMixin from 'NativeMethodsMixin';

//should be called on render rather than caching the value, it may change e.g. due to rotation
var Window = Dimensions.get('window');
const ROW_HEIGHT = listStyle.listItemContainer.height;
const DROP_CONTAINER_HEIGHT = 40;
const ROW_DROP_ENABLE_HEIGHT = ROW_HEIGHT / 2;
const DRAGGABLE_HEIGHT_DEFAULT = 30;
const SCROLL_OFFSET = 2;
const SCROLL_GUTTER = 10;
const DRAGGABLE_WIDTH_ON_APPEARANCE = 200;
const DRAGGABLE_OPACITY_ON_APPEARANCE = 0.5;
const DRAGGABLE_WIDTH_DEFAULT = 300;
const DRAGGABLE_OPACITY_DEFAULT = 0;
const DRAGGABLE_OPACITY_FINAL = 1;
const ModifyData = (data) => {
    //TODO - check the data before adding these properties
    return data.map((item, index) => {
        let newItem = item.set('index', index);
        newItem = newItem.set('selceted', false);
        return newItem.set('dropRowContainer', false);
    })
}

export default class MultiSelectDragDropListView extends Component {
    constructor(props) {
        super();
        var rowHasChangedFunc = props.rowHasChanged || {
            rowHasChanged: (r1, r2) => r1 !== r2
        }
        var ds = new ListView.DataSource(rowHasChangedFunc)
        var updatedData = ModifyData(props.data);
        this.state = {
            dataSource: ds.cloneWithRows(updatedData),
            updatedData: updatedData,
            pan: new Animated.ValueXY(),
            prevDropRowIndex: -1,
            currDropRowIndex: -1,
            selectedRowIndex: new Animated.Value(-1),
            draggableOpacity: new Animated.Value(DRAGGABLE_OPACITY_DEFAULT),
            draggableHeight: new Animated.Value(Window.height),
            draggableTop: new Animated.Value(0)
        }
        this.layoutMap = [];
        this._responderCreate();
        this._bindFunctions();
        this.totalScrollOffset = 0;
        this.moveStartOffset = 0;
        this.draagablePanStartRespond = false;
        this.draggablePanStartRespondTimeoutReference = null;
        this.listContainerPositionRelToPage = {
            x: 0,
            y: 0
        }
    }
    _responderCreate() {
        this._draggablePanResponderCreate();
        this._listViewPanResponderCreate();
        this._listViewItemPanResponderCreate();
    }
    _getDraggableDefaultPosition() {
        return {
            x: 20,
            y: Window.height - this.listContainerPositionRelToPage.y - 60
        };
    }
    _listViewPanResponderCreate() {
        this._listViewPanResponder = PanResponder.create({
            onPanResponderTerminationRequest: () => true
        })
    }
    _listViewItemPanResponderCreate() {
        this._listViewItemPanResponder = PanResponder.create({
            onPanResponderTerminationRequest: () => true
        })
    }
    _draggablePanResponderCreate() {
        this._panResponderMap = PanResponder.create({
            onStartShouldSetPanResponder: () => {
                return ((this.state.selectedRowIndex._value != -1))
            },
            onMoveShouldSetPanResponder: () => {
                return ((this.state.selectedRowIndex._value != -1))
            },
            onMoveShouldSetPanResponderCapture: () => {
                return ((this.state.selectedRowIndex._value != -1))
            },
            onStartShouldSetPanResponderCapture: () => {
                return true
            },
            onPanResponderMove: (e, gestureState) => {
                if ((this.state.selectedRowIndex._value == -1)) {
                    var movement = gestureState.y0 - gestureState.moveY;
                    if (Math.abs(movement) > 50) {
                        this.draagablePanStartRespond = false;
                        if (this.draggablePanStartRespondTimeoutReference) {
                            this.clearTimeout(this.draggablePanStartRespondTimeoutReference);
                            this.draggablePanStartRespondTimeoutReference = null;
                        }
                    } else {
                        return
                    }

                    var scrollTo = this.moveStartOffset + movement;
                    this.listView.scrollTo({
                        y: scrollTo,
                        animated: true
                    })
                    return;
                }

                var scrollDown = (gestureState.moveY + DRAGGABLE_HEIGHT_DEFAULT + SCROLL_GUTTER) > Dimensions.get('window').height;
                var scrollUp = ((gestureState.moveY - SCROLL_GUTTER) < 0) && (this.totalScrollOffset > 0);
                if (scrollDown || scrollUp && false) {
                    // let scrollIntensityOffset = SCROLL_OFFSET;
                    // if (scrollDown) {
                    //     scrollIntensityOffset =  gestureState.moveY - Dimensions.get('window').height - 10;
                    // } else {
                    //     scrollIntensityOffset =  gestureState.moveY - 0;
                    // }
                    // if (scrollIntensityOffset < SCROLL_OFFSET) {
                    //     scrollIntensityOffset = SCROLL_OFFSET
                    // }
                    //
                    // if (!this._autoScrollingInterval) {
                    //     this._autoScrollingInterval =  this.setInterval(() => {
                    //         this.totalScrollOffset += scrollDown ? scrollIntensityOffset : (-scrollIntensityOffset);
                    //         this.listView.scrollTo({
                    //             y: this.totalScrollOffset,
                    //             animated: true
                    //         });
                    //         this.moveDropRowContainer(gestureState, {
                    //             pan: this.state.pan//[item.index]
                    //         });
                    //     }, 20);
                    // }
                    // return;
                } else if (this._autoScrollingInterval) {
                    this.clearInterval(this._autoScrollingInterval);
                    this._autoScrollingInterval = null;
                }
                this.moveDropRowContainer(gestureState, {
                    pan: this.state.pan//[item.index]
                });
            },
            onPanResponderStart: (e, gestureState) => {
                if (this.state.selectedRowIndex._value != -1) {
                    this.state.pan.setOffset({
                        x: -e.nativeEvent.locationX,
                        y: -e.nativeEvent.locationY
                    });
                } else {
                    var draggableNativeEvent = e.nativeEvent;
                    this.moveStartOffset = this.totalScrollOffset;
                    this.draagablePanStartRespond = true;
                    this.draggablePanStartRespondTimeoutReference = this.setTimeout(() => {
                        if (this.draagablePanStartRespond) {
                            this.draagablePanStartRespond = false;
                            this.onDraggableLongPress(gestureState.y0);
                        }
                    }, 1000)
                }
            },
            onPanResponderRelease: (e, gestureState) => {
                if (this._autoScrollingInterval) {
                    this.clearInterval(this._autoScrollingInterval);
                    this._autoScrollingInterval = null;
                }
                if (this.draggablePanStartRespondTimeoutReference) {
                    this.clearTimeout(this.draggablePanStartRespondTimeoutReference);
                    this.draggablePanStartRespondTimeoutReference = null;
                }
                if (this.draagablePanStartRespond) {
                    this.draagablePanStartRespond = false;
                    let index = this._getRowIndexByY(gestureState.y0 + this.totalScrollOffset)//null;
                    if (index) {
                        this._onRowPress();
                    }
                } else {
                    let prevDropRowContainer = _.find(this.state.updatedData,
                        item => item.get('dropRowContainer'));
                    if (prevDropRowContainer) {
                        let preDropIndex = prevDropRowContainer.get('index');
                        updatedData = [
                            ...this.state.updatedData.slice(0, preDropIndex),
                            this.state.updatedData[preDropIndex].set('dropRowContainer', false),
                            ...this.state.updatedData.slice(preDropIndex + 1)
                        ];
                        this.setState({
                            updatedData: updatedData,
                            dataSource: this.state.dataSource.cloneWithRows(updatedData)
                        })
                    }
                    if (this.state.selectedRowIndex._value != -1) {
                        //set poistion of pan near to bottom
                        //change width, opacity
                        this.state.pan.setValue(this._getDraggableDefaultPosition());
                        this.state.draggableOpacity.setValue(DRAGGABLE_OPACITY_FINAL);
                    }
                }
            }
        })
    }
    _moveDropRowContainer(gestureState, options) {
        if (((gestureState.moveY + DRAGGABLE_HEIGHT_DEFAULT + SCROLL_GUTTER) < Dimensions.get('window').height) &&
        ((gestureState.moveY - SCROLL_GUTTER) > 0)){
            options.pan.setValue({
                x: 20,
                y: gestureState.moveY- this.listContainerPositionRelToPage.y
            });
        }
        let dropIndex = Math.ceil((gestureState.moveY - this.listContainerPositionRelToPage.y - ROW_DROP_ENABLE_HEIGHT + this.totalScrollOffset) / ROW_HEIGHT);
        let prevDropRowContainer = _.find(this.state.updatedData, item => item.get('dropRowContainer'));
        var updatedData = null;
        if (!prevDropRowContainer) {
            updatedData = [
                ...this.state.updatedData.slice(0, dropIndex),
                this.state.updatedData[dropIndex].set('dropRowContainer', true),
                ...this.state.updatedData.slice(dropIndex + 1)
            ];
        } else {
            let preDropIndex = prevDropRowContainer.get('index');
            if (dropIndex < preDropIndex) {
                updatedData = [
                    ...this.state.updatedData.slice(0, dropIndex),
                    this.state.updatedData[dropIndex].set('dropRowContainer', true),
                    ...this.state.updatedData.slice(dropIndex + 1, preDropIndex),
                    this.state.updatedData[preDropIndex].set('dropRowContainer', false),
                    ...this.state.updatedData.slice(preDropIndex + 1)
                ];
            } else if (dropIndex > preDropIndex) {
                updatedData = [
                    ...this.state.updatedData.slice(0, preDropIndex),
                    this.state.updatedData[preDropIndex].set('dropRowContainer', false),
                    ...this.state.updatedData.slice(preDropIndex + 1, dropIndex),
                    this.state.updatedData[dropIndex].set('dropRowContainer', true),
                    ...this.state.updatedData.slice(dropIndex + 1)
                ];
            }
        }

        if (updatedData) {
            this.setState({
                updatedData: updatedData,
                dataSource: this.state.dataSource.cloneWithRows(updatedData)
            })
        }

        // if ((this.state.currDropRowIndex != dropIndex) ||
        //    (this.state.currDropRowIndex != this.state.prevDropRowIndex)) {
        //    this.setState({
        //        prevDropRowIndex: this.state.currDropRowIndex,
        //        currDropRowIndex:  dropIndex,
        //        dataSource: this.state.dataSource.cloneWithRows(this.state.updatedData)
        //    })
        // }
        // }
        // else if (this.state.currDropRowIndex != -1) {
        //     this.setState({
        //         prevDropRowIndex: -1,
        //         currDropRowIndex: -1,
        //         dataSource: this.state.dataSource.cloneWithRows(updatedData)
        //     })
        // }
    }
    _bindFunctions() {
        //check this
        this.getListView = this._getListView.bind(this);
        this.getDraggableContainerView = this._getDraggableContainerView.bind(this);
        this.renderRow = this._renderRow.bind(this);
        this.rowLayout = this._rowLayout.bind(this);
        this.renderRowDropContainer = this._renderRowDropContainer.bind(this);
        this.renderActualRow = this._renderActualRow.bind(this);
        this.moveDropRowContainer = this._moveDropRowContainer.bind(this);
        this.onListViewScroll = this._onListViewScroll.bind(this);
        this.onDraggableLongPress = this._onDraggableLongPress.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        var updatedData = ModifyData(nextProps.data);
        this.setState({
            updatedData: updatedData,
            dataSource: this.state.dataSource.cloneWithRows(updatedData)
        })
    }
    render() {
        Window = Dimensions.get('window');
        return (
            <View style={styles.container}>
                {this.getListView()}
                {
                    this.getDraggableContainerView({
                            pan: this.state.pan,
                            panResponder: this._panResponderMap,
                            index: 0
                        })
                }
            </View>
        )
    }
    _getListView() {
        return (
            <View style={styles.listViewContainer}
                ref={el => {
                    if (el) {
                        this.listViewContainerEl = el;
                    }
                }}
                onLayout={() => {
                    if (this.listViewContainerEl) {
                        this.listViewContainerEl.measure((fx, fy, width, height, px, py) => {
                            this.listContainerPositionRelToPage.x = px;
                            this.listContainerPositionRelToPage.y = py;
                        })
                    }
                }}
            >
                <ListView
                    renderScrollComponent={props => <InfiniteScrollView {...props} />}
                    {...this.props}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    ref={el => {
                        this.listView = el;
                    }}
                    enableEmptySections={true}
                    canLoadMore={true}
                    {...this._listViewPanResponder.panHandlers}
                    onScroll={this.onListViewScroll}
                />
            </View>
        )
    }
    _onListViewScroll(e) {
        this.totalScrollOffset = e.nativeEvent.contentOffset.y;
    }
    _renderRow(item, section, index) {
        return (
            <View
                style={{
                    flex: 1,
                    height: item.get('dropRowContainer') ? (ROW_HEIGHT + DROP_CONTAINER_HEIGHT) : ROW_HEIGHT
                }}
                onLayout={(e) => this._rowLayout(e, index)}
            >
                {this.renderRowDropContainer(item)}
                {this.renderActualRow(item, index)}
            </View>
        )
    }
    _renderActualRow(item, rowIndex) {
        return (
            <TouchableHighlight
                style={{
                        backgroundColor: item.get('selected') ? 'grey' : 'transparent'
                    }}
                underlayColor={item.get('selected') ? 'grey' : 'transparent'}
                {...this._listViewItemPanResponder.panHandlers}
            >
                <View>
                    {this.props.renderRow(item)}
                </View>
            </TouchableHighlight>
        )
    }
    _renderRowDropContainer(item) {
        if (item.get('dropRowContainer')) {
            return (
                <View
                    style={styles.rowDropContainer}
                >
                    <Text style={styles.rowDropContainerText}>
                        Drop here!!
                    </Text>
                </View>
            )
        } else {
            return null
        }
    }
    _rowLayout(e, index) {
        this.layoutMap[index] = e.nativeEvent.layout
    }
    _getDraggableContainerView(options) {
        let selectedCount = this._getSelectedCount();
        return (
            <Animated.View
                style={[options.pan.getLayout(), styles.draggable, {
                    opacity: this.state.draggableOpacity,
                    height: this.state.draggableHeight,
                    width: DRAGGABLE_WIDTH_ON_APPEARANCE,
                }]}
                {...options.panResponder.panHandlers}
                 ref={(el) => {this._draggableElement = el}}
                 key={options.index}
            >
                <TouchableHighlight
                    onLongPress={(e) => {
                        var touchYCoordinate = e.touchHistory.touchBank[0].startPageY;
                        this.onDraggableLongPress(touchYCoordinate);
                    }}
                    style={{
                        height: this.state.draggableHeight._value
                    }}
                >
                    <View>
                        <Text>
                            Selected Item : {selectedCount}
                        </Text>
                    </View>
                </TouchableHighlight>
            </Animated.View>
        )
    }
    _onDraggableLongPress(touchYCoordinate) {
        var index = this._getRowIndexByY(touchYCoordinate + this.totalScrollOffset);

        updatedData = [
            ...this.state.updatedData.slice(0, index),
            this.state.updatedData[index].set('selected', !this.state.updatedData[index].get('selected')),
            ...this.state.updatedData.slice(index + 1)
        ];

        this.setState({
            updatedData : updatedData,
            dataSource: this.state.dataSource.cloneWithRows(updatedData)
        })
        this.state.selectedRowIndex.setValue(index)
        this.state.draggableOpacity.setValue(DRAGGABLE_OPACITY_ON_APPEARANCE)
        this.state.draggableHeight.setValue(DRAGGABLE_HEIGHT_DEFAULT)
        this.state.pan.setValue({
            x: 20,
            y: touchYCoordinate - this.listContainerPositionRelToPage.y
        })

    }
    _getRowIndexByY(y) {
        var rowIndex = 0;
        for (var i = 0; i < this.layoutMap.length; i++) {
            let rowTop = this.listContainerPositionRelToPage.y + this.layoutMap[i].y;
            if ((rowTop <= y) && ((rowTop + ROW_HEIGHT) > y)) {
                rowIndex = i;
                break;
            }
        }
        return rowIndex;
    }
    _getSelectedCount() {
        return this.state.updatedData.filter(item => item.get('selected')).length;
    }
    _onRowPress() {
        //console.log('on row press');
    }
    _onRowLongPress(item) {
        // let selectedCount = this._getSelectedCount();
        //
        // itemIndex = this.state.updatedData.findIndex(dataItem => item.id == dataItem.id);
        //
        // updatedData = [
        //     ...updatedData.slice(0, itemIndex),
        //     {
        //         ...item,
        //         selected: !item.selected
        //     },
        //     ...updatedData.slice(itemIndex + 1, updatedData.length)
        // ];
        // this.state.selectedRowIndex.setValue(itemIndex)
        // this.state.draggableOpacity.setValue(1)//Map[itemIndex]
        // this.setState({
        //     dataSource: this.state.dataSource.cloneWithRows(updatedData),
        // });
    }
    _onRowPressOut(item) {
        //  this.state.pan[item.index].setValue(this._getDraggableDefaultPosition());
    }
}

reactMixin(MultiSelectDragDropListView.prototype, timerMixin);
reactMixin(MultiSelectDragDropListView.prototype, NativeMethodsMixin);

const styles = StyleSheet.create({
    ...listStyle,
    draggable: {
        position: 'absolute',
        backgroundColor: 'rgb(210, 180, 180)',
        width: 150,
        height: DRAGGABLE_HEIGHT_DEFAULT
    },
    rowDropContainer: {
        height: DROP_CONTAINER_HEIGHT,
        backgroundColor: 'rgb(220, 260, 270)'
    },
    rowDropContainerText: {
        fontSize: 18
    }
});
