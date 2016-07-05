import common from './common.js';

export default {
    ...common,
    listViewContainer: {
        flex: 1
    },
    // listItemCotainer: {
    //     backgroundColor: 'rgb(240, 240, 240)',
    //     alignItems: 'flex-start',
    //     flex: 1,
    //     marginBottom: 2,
    //     paddingLeft: 5,
    //     height:60,
    // },
    listItemCotainer:{
      height:60,
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
  flex:1,
  justifyContent: 'center' ,

},
  icon:{
      height:25,
      width:25,
      marginRight:20,
    },
    roundball:{
    width: 30,
    height: 25,
    borderRadius:10,
    backgroundColor: 'gray',
    alignItems:'center',
    justifyContent:'center',
    marginRight:20,
  },
    heading: {
      fontSize: 20,
      margin: 10,
      color: 'black',
      fontWeight: 'bold',
    },
}
