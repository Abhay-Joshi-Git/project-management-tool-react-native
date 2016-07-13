import common from './common.js';
import * as MK from 'react-native-material-kit';

const { MKButton ,MKColor} = MK;

const fab = {
    height: 50,
    width: 50
}
export const MKTheme={
  primaryColor:MKColor.Red,
  accentColor :MKColor.Red,
};
MK.setTheme(MKTheme);

export const ColoredFab=MKButton.accentColoredFab()
  .build();

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
    sprintContainer:{
      flexDirection:'row',
    },
    sprintLeft:{
      flex:.45,
    },
    sprintCenter:{
      flex:.45,
      alignItems:'flex-start',
      justifyContent:'center',
    },
    sprintRight:{
        flex:.10,
        alignItems:'flex-start',
        justifyContent:'center'
    },
    backlogContainer:{
      flexDirection:'row',
    },
    backlogLeft:{
      flex:.45,
    },
    backlogRight:{
      flex:.55,
      alignItems:'flex-start',
      justifyContent:'center',
    },
    summaryText:{
        justifyContent:'flex-end',
        fontSize:15,
        marginLeft:5,
        color:'black'
    },
    toolbar:{
      height:56,
      backgroundColor:'#1fad8a',
    },
    iconContainer:{
      flexDirection:'row',
      height:60,
      backgroundColor:'teal',
    },
    toolbarMenu:{
      flex:.15,
      justifyContent:'center',
      marginLeft:15,
    },
    toolbarTitle:{
      flex:.60,
      justifyContent:'center',
      alignItems:'center'
    },
    toolbarActions:{
      flex:.25,
      flexDirection:'row',
      justifyContent:'flex-end',
      alignItems:'center',
      marginRight:18,
    },
    footerFab: {
        position: 'absolute',
        bottom: 48,
        right: 27,
        justifyContent:'center',
        alignItems:'center',
        ...fab
    },
    fab: {
        ...fab
    },
    toolbarStyle:{
      backgroundColor: '#e9eaed',
       height: 56,
    },
  }
