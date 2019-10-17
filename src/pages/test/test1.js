import React, {Component} from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Switch
} from "react-native";

import flex from '../../assets/styles/layout.flex'
import Button from '../../components/common/button/button'
import Input from '../../components/common/input/input'
import SearchInput from '../../components/common/input/searchInput'
import IconList from '../../components/common/list/iconList'
import SwitchListItem from '../../components/common/list/switchListItem'
import ModalExample from '../../components/common/misc/modalExample'
import Tags from '../../components/common/misc/tags'
import WordField from '../../components/common/misc/wordField'

const listData = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Address Book',
    onPress: ()=>{
      alert('Address Book')
    },
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Share rWallet',
    onPress: ()=>{
      alert('Address Book')
    },
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Notifications',
    onPress: ()=>{
      alert('Address Book')
    },
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d721',
    title: 'Language',
    onPress: ()=>{
      alert('Language')
    },
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d722',
    title: 'Currency',
    onPress: ()=>{
      alert('Currency')
    },
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d723',
    title: 'Two-Factor Authentication',
    onPress: ()=>{
      alert('Two-Factor Authentication')
    },
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d724',
    title: 'Lock',
    onPress: ()=>{
      alert('Lock')
    },
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d725',
    title: 'Help & Support',
    onPress: ()=>{
      alert('Help & Support')
    },
  },
];

const tagDatas = ["uncle", "cave", "donkey", "solar", "sweet", "canyon", "bonus", "busy", "nose", "tool", "position", "joy"];

class Test1 extends Component {
    static navigationOptions = {
    };
    constructor(props){
        super(props);
    }
    render() {
        return (
            <View style={[flex.flex1]}>
                <ScrollView style={{marginBottom: 5}}>
                    <View style={styles.sectionContainer}>
                        <Text>This is the test page 1</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => this.props.navigation.navigate('Test2')}>
                            <Text style={styles.text}>Go to Test 2 Tab</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.sectionContainer}>
                        <Text>This is the test page</Text>
                        <Text style={styles.sectionTitle}>Button</Text>
                        <Button text="GET STARTED" onPress={()=>{
                            alert('You click me!');
                        }} />
                    </View>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Input</Text>
                        <Input placeholder="Type address here..." />
                    </View>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>SearchInput</Text>
                        <SearchInput placeholder="Start Searching For Assets" />
                    </View>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>IconList</Text>
                        <IconList data={listData}/>
                    </View>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>SwitchListItem</Text>
                        <SwitchListItem title="Use Fingerprint" value={true}/>
                    </View>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Tags</Text>
                        <Tags data={tagDatas} />
                    </View>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>WordField</Text>
                        <WordField text="canyon"/>
                    </View>
                </ScrollView>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: 'green',
        padding: 12,
        width: 280,
        marginTop: 12,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#000',
        marginBottom: 10,
    },
    sectionContainer: {
        marginTop: 10,
        paddingHorizontal: 10,
    },
});

export default Test1;
