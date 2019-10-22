import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Image
} from 'react-native';
import flex from '../../assets/styles/layout.flex';
import wallet from '../../common/wallet/wallet';
import Entypo from 'react-native-vector-icons/Entypo';
import Tags from '../../components/common/misc/tags';
import Button from '../../components/common/button/button';

const header = require('../../assets/images/misc/header.png')

const styles = StyleSheet.create({
    text: {},
    backButton: {
      position: 'absolute',
      left: 10,
      top: 70,
    },
    headerView: {
      position: 'absolute',
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: '900',
      position: 'absolute',
      top: 132,
      left: 24,
      color: '#FFF',
    },
    chevron: {
      color: '#FFF',
    },
    note: {
      textAlign: 'center',
      fontSize: 15,
      lineHeight: 20,
      marginHorizontal: 45,
      fontWeight: '500',
      letterSpacing: 0.29,
    },
    copy: {
      textAlign: 'center',
      color: '#00B520',
      fontSize: 15,
    },
    tagsView: {
      marginTop: 15,
      marginHorizontal: 20,
    },
    buttonView: {
      flexDirection: 'row',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 10,
      width: '100%',
    }
});

class RecoveryPhrase extends Component {
    static navigationOptions = ({ navigation }) => {
      return{
        header: null,
      }
    };
    constructor(props){
      super(props);
      this.state = {
        recoverPhrase: '',
        phrases: [],
      };
    }
    componentDidMount(){
      let recoverPhrase = wallet.generateRecoverPhrase();
      let phrases = recoverPhrase.split(' ');
      this.setState({recoverPhrase, phrases});
    }
    render() {
      return (
        <View style={[flex.flex1]}>
          <View>
            <Image source={header} />
            <View style={styles.headerView}>
              <Text style={styles.headerTitle}>Recovery Phrase</Text>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  const { navigation } = this.props;
                  navigation.goBack();
                }}
              >
                <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={[styles.note, {marginTop: 20}]}>Write down or copy these words in</Text>
          <Text style={styles.note}>the right order and save them</Text>
          <Text style={styles.note}>somewhere safe</Text>
          <View style={styles.tagsView}>
            <Tags data={this.state.phrases} />
          </View>
          <TouchableOpacity style={{marginTop: 10}} onPress={() => {}} >
            <Text style={styles.copy}>Copy</Text>
          </TouchableOpacity>
          <View style={styles.buttonView}>
            <Button text="NEXT" onPress={() => {}} />
          </View>
        </View>
      );
    }
}
export default RecoveryPhrase;
