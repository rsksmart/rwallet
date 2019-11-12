import React, {Component} from 'react';
import {
	View, Text, ScrollView, StyleSheet
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import Tags from '../../components/common/misc/tags'
import Header from '../../components/common/misc/header'
import WordField from '../../components/common/misc/wordField'
import Alert from '../../components/common/modal/alert';

const styles = StyleSheet.create({
	wordFieldView: {
		height: 150,
		marginTop: 15,
	},
	tags: {
		justifyContent: 'center',
    	alignItems: 'center',
    	marginTop: 15,
    	marginHorizontal: 20,
    	alignSelf: 'center',
	},
	tip: {
		color: '#000000',
		fontSize: 15,
		fontWeight: '500',
		letterSpacing: 0.29,
		alignSelf: 'center',
	}
});

export default class VerifyPhrase extends Component {
	static navigationOptions = ({navigation})=>{
		return {
			header: null,
		}
	}
	constructor(props){
		super(props);
		this.wallet = this.props.navigation.state.params.wallet;
		this.correctPhrases = this.wallet.mnemonic.phrase.split(' ');
		let shuffle = (org)=>{
			let input = [];
			Object.assign(input, org);
		    for (var i = input.length-1; i >=0; i--) {
		        var randomIndex = Math.floor(Math.random()*(i+1));
		        var itemAtIndex = input[randomIndex];
		        input[randomIndex] = input[i];
		        input[i] = itemAtIndex;
		    }
		    return input;
		}
		this.randomPhrases = shuffle(this.correctPhrases);
		this.randomPhrases2 = [];
		Object.assign(this.randomPhrases2, this.randomPhrases);

		this.state = {
			tags: this.randomPhrases,
			phrases : [],
		};
		this.renderAllItem = this.renderAllItem.bind(this);
		this.tap = this.tap.bind(this);
		this.reset = this.reset.bind(this);
	}
	reset(){
		Object.assign(this.randomPhrases, this.randomPhrases2);
		this.setState({
			tags: this.randomPhrases,
			phrases : [],
		});
	}
	async tap(i){
		let s = this.state.tags.splice(i, 1);
		this.setState({tags: this.state.tags});
		this.state.phrases.push(s[0]);
		this.setState({phrases: this.state.phrases});
		if(this.state.phrases.length===12){
			let same = true;
			for(let i=0; i<this.state.phrases.length; i++){
				let phrase = this.state.phrases[i];
				let c = this.correctPhrases[i];
				if(c!==phrase){
					same = false;
					break;
				}
			}
			if(same){
				await walletManager.addWallet(this.wallet);
				const resetAction = StackActions.reset({
					index: 1,
					actions: [
						NavigationActions.navigate({ routeName: 'Test1' }),
						NavigationActions.navigate({ routeName: 'WalletList' })
					],
				});
				this.props.navigation.dispatch(resetAction);
			} else {
				this.alert.setModalVisible(true); 
			}
			
		}
	}
	renderAllItem(){
		let startX = -82;
		let startY = 0;
		let words = [];
		let margin = 200;
		let offset = 0;
		if(this.state.phrases.length>1){
			offset = -margin*(this.state.phrases.length-1);
		} 
		for(let i=0; i<12; i++){
			let marginLeft = startX + i*margin + offset;
			let style = {position:'absolute', left: '50%', top:10, marginLeft: marginLeft};
			let text = '';
			if(i<this.state.phrases.length){
				text = this.state.phrases[i];
			}
			words.push(<View style={style} key={Math.random()+''}><WordField text={text} /></View>);
		}
		return words;
	}
	render(){
		let alertTitle = "It's important that you write your recovery phrase down corretly. If something happens to your wallet, you'll need it to recover your money. Please review and try again.";
		let alertPress = ()=>{
			this.reset();
		}
		return (
			<View>
				<Header title="Verify Your Phrase" goBack={()=>{
					if(this.state.phrases.length===0){
		            	this.props.navigation.goBack();
		            } else {
		            	this.reset();
		            }
				}} />
				<View style={styles.wordFieldView}>
	                {this.renderAllItem()}
	            </View>
				<Text style={styles.tip}>Tap each word in the correct order</Text>
				<Tags data={this.state.tags} style={[styles.tags]} showNumber={false} onPress={(i)=>{
					this.tap(i);
				}}/>
				<Alert ref={(ref)=>{this.alert = ref;}} title={alertTitle} onPress={()=>{
					this.reset();
				}}/>
			</View>
		);
	}
}