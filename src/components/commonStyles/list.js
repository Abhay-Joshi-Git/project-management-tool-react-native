import common from './common.js';

export default {
    ...common,
    listViewContainer: {
        flex: 1,
    },
    listItemCotainer: {
        height:75,
        borderBottomWidth:1,
        borderBottomColor: 'black',
        flex:1,
        flexDirection:'row',
    },
    icon: {
        height:25,
        width:25,
    },
    ellipse: {
        width: 37,
        height: 30,
        borderRadius:37,
        backgroundColor: '#eaeded',
        alignItems:'center',
        justifyContent:'center'
    },
    leftContainer: {
        flex:.90,
        flexDirection:'column'
    },
    topContainer: {
        flex:1,
        flexDirection:'row'
    },
    topLeft: {
        flex:3,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
    },
    topRight: {
        flex:1,
        alignItems:'center',
        justifyContent:'flex-end',
    },
    bottomContainer:  {
        flex:1,
    },
    rightContainer:{
        flex:.10,
        alignItems:'flex-start',
        justifyContent:'center'
    },
    separator: {
        height:1,
        backgroundColor: 'black'
    },
    sprintLeft:{
        flex:.90,
        alignItems:'flex-start'
    },
    sprintRight:{
        flex:.10,
        alignItems:'flex-start',
        justifyContent:'center'
    },
    summaryText:{
        justifyContent:'flex-end',
        fontSize:15,
        marginLeft:5,
        color:'black'
    }
}
