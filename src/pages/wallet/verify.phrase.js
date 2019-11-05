import React, {Component} from 'react';
import {
	View, Text, ScrollView, StyleSheet
} from 'react-native';
import Tags from '../../components/common/misc/tags'
import Header from '../../components/common/misc/header'
import WordField from '../../components/common/misc/wordField'

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
		this.correctPhrases = "device figure absorb other sister noise mention over curious shallow auto rude".split(' ');
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
		this.state = {
			tags: this.randomPhrases,
			phrases : [],
		}
		this.renderAllItem = this.renderAllItem.bind(this);
		this.tap = this.tap.bind(this);
	}
	tap(i){
		let s = this.state.tags.splice(i, 1);
		this.setState({tags: this.state.tags});
		this.state.phrases.push(s[0]);
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
		return (
			<View>
				<Header title="Verify Your Phrase" goBack={this.props.navigation.goBack} />
				<View style={styles.wordFieldView}>
	                {this.renderAllItem()}
	            </View>
				<Text style={styles.tip}>Tap each word in the correct order</Text>
				<Tags data={this.state.tags} style={[styles.tags]} showNumber={false} onPress={(i)=>{
					this.tap(i);
				}}/>
			</View>
		);
	}
}