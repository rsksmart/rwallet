import React, {Component} from 'react';
import {
	View, Text, ScrollView
} from 'react-native';
import Tags from '../../components/common/misc/tags'
import Header from '../../components/common/misc/header'

const styles = StyleSheet.create({
	scrollViewStyle: {

	},
});

export default class VerifyPhrase extends Component {
	static navigationOptions = ({navigation})=>{
		return {
			header: null,
		}
	}
	constructor(props){
		super(props);
		this.state = {
			phrases: ["aaa", "bbb"];
		}
		this.renderAllItem = this.renderAllItem.bind(this);
	}
	renderAllItem(){
		return (<View></View>);
	}
	render(){
		return (
			<Header title="Verify Your Phrase" goBack={this.props.navigation.goBack} />
			<ScrollView
                style={styles.scrollViewStyle}
                horizontal={true} // 横向
                >
                {this.renderAllItem()}
            </ScrollView>
			<Text>Tap each word in the correct order</Text>
			<Tags data={this.state.phrases} />
		);
	}
}