import React, {Component} from 'react';
import {
	View, Text, Image, StyleSheet
} from 'react-native';
import Tags from '../../components/common/misc/tags'
import Header from '../../components/common/misc/header'
import Button from '../../components/common/button/button'
const logo = require('../../assets/images/icon/logo.png')

const styles = StyleSheet.create({
	page: {
		alignItems: 'center',
		// justifyContent: 'center',
		flex: 1,
	},
	logo: {
		position: 'absolute',
		top: '25%',
	},
	buttonView: {
		position: 'absolute',
		bottom: '10%',
	},
});

export default class StartPage extends Component {
	static navigationOptions = ({navigation})=>{
		return {
			header: null,
		}
	}
	constructor(props){
		super(props);
	}
	render(){
		return (
			<View style={styles.page}>
				<Image style={styles.logo} source={logo} />
				<View style={styles.buttonView}>
					<Button style={styles.button} text="GET STARTED" onPress={()=>{
						this.props.navigation.navigate('TermsPage');
					}} />
				</View>
			</View>
		);
	}
}