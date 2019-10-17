import React,{Component} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
// const screenWidth = Dimensions.get('window').width;
export default class DashLine extends Component{
    constructor(props){
        super(props);
    }
    render(){
        var len = Math.ceil(this.props.width/4);
        var arr = [];
        for(let i=0; i<len; i++){
            arr.push(i);
        }
        return (
            <View>
                <View style={styles.dashLine}>{
                    arr.map((item, index)=>{
                        return <Text style={styles.dashItem} key={'dash'+index}> </Text>
                    })
                }</View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    dashLine: {
        flexDirection: 'row',
    },
    dashItem: {
        height: 1,
        width: 2,
        marginRight: 2,
        backgroundColor: '#979797',
    }
});