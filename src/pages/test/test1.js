import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import flex from '../../assets/styles/layout.flex';
import Button from '../../components/common/button/button';
import Input from '../../components/common/input/input';
import SearchInput from '../../components/common/input/searchInput';
import IconList from '../../components/common/list/iconList';
import IconTwoTextList from '../../components/common/list/iconTwoTextList';
import SwitchListItem from '../../components/common/list/switchListItem';
import Tags from '../../components/common/misc/tags';
import WordField from '../../components/common/misc/wordField';
import TouchSensorModal from '../../components/common/modal/touchSensorModal';
import PasscodeModal from '../../components/common/modal/passcodeModal';
import Alert from '../../components/common/modal/alert';
import SwipableButtonList from '../../components/common/misc/swipableButtonList';
import Picker from '../../components/common/input/picker';
import wallet from '../../common/wallet/wallet';
import storage from '../../common/storage'

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 12,
    minWidth: 130,
    marginTop: 12,
    marginLeft: 10,
  },
  text: {
    color: '#FFF',
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

const listData = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'Address Book',
    onPress: () => {},
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Share rWallet',
    onPress: () => {},
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Notifications',
    onPress: () => {},
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d721',
    title: 'Language',
    onPress: () => {},
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d722',
    title: 'Currency',
    onPress: () => {},
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d723',
    title: 'Two-Factor Authentication',
    onPress: () => {},
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d724',
    title: 'Lock',
    onPress: () => {},
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d725',
    title: 'Help & Support',
    onPress: () => {},
  },
];

const tagDatas = ['uncle', 'cave', 'donkey', 'solar', 'sweet', 'canyon', 'bonus', 'busy', 'nose', 'tool', 'position', 'joy'];

const swipableData = [
  {
    key: '1', title: 'BTC', text: 'BTC Wallet', worth: '$23812.48', amount: 570,
  },
  {
    key: '2', title: 'RIF', text: 'RIF Wallet', worth: '$454.23', amount: 22,
  },
];

class Test1 extends Component {
    static navigationOptions = ({ navigation }) => {
        return{
            header: null,
        }
    };
    async save(k:string, v:any, id:string) {
        await storage.save(
            k,
            v,
            id
        );
    }
    render() {
      const { navigation } = this.props;
      return (
        <View style={[flex.flex1]}>
          <ScrollView style={{ marginBottom: 5 }}>
          	<View style={styles.sectionContainer}>
            	<Text>This is the test page 1</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={async () => {
                        const random = Math.random();
                        await this.save('TEST2NUM', random);
                        this.props.navigation.navigate('Test2')
                    }}>
                    <Text style={styles.text}>Go to Test 2 Tab</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Pages</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    navigation.navigate('WalletTest');
                  }}
                >
                  <Text style={styles.text}>Test Wallet</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    navigation.navigate('WalletAddIndex');
                  }}
                >
                  <Text style={styles.text}>Add Wallet</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    navigation.navigate('WalletSelectCurrency');
                  }}
                >
                  <Text style={styles.text}>SelectCurrency</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    navigation.navigate('WalletCreate');
                  }}
                >
                  <Text style={styles.text}>Create Wallet</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    navigation.navigate('RecoveryPhrase');
                  }}
                >
                  <Text style={styles.text}>Recovery Phrase</Text>
                </TouchableOpacity>
              </View>
>>>>>>> d59ca6d... Create wallet address
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Swipable ListItem</Text>
              <SwipableButtonList data={swipableData} />
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Test List</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    navigation.navigate('Test2');
                  }}
                >
                  <Text style={styles.text}>scan</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    navigation.navigate('Test3');
                  }}
                >
                  <Text style={styles.text}>List</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    wallet.newWallet();
                  }}
                >
                  <Text style={styles.text}>New Wallet</Text>
                </TouchableOpacity>
                <TouchSensorModal ref={(ref) => { this.touchSensor = ref; }} />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.touchSensor.setModalVisible(true);
                  }}
                >
                  <Text style={styles.text}>Touch Sensor</Text>
                </TouchableOpacity>
                <PasscodeModal ref={(ref) => { this.passcodeModal = ref; }} />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.passcodeModal.setModalVisible(true);
                  }}
                >
                  <Text style={styles.text}>Passcode Modal</Text>
                </TouchableOpacity>
                <Alert ref={(ref) => { this.alert = ref; }} title="Safeguard your recovery phrase" text="Your recovery phrase is composed of 12 randomly selected words. Please carefully write down each word in the order they appear." />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.alert.setModalVisible(true);
                  }}
                >
                  <Text style={styles.text}>Alert</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Button</Text>
              <Button
                text="GET STARTED"
                onPress={() => {}}
              />
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
              <IconList data={listData} />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>SwitchListItem</Text>
              <SwitchListItem title="Use Fingerprint" value />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>IconTwoTextList</Text>
              <IconTwoTextList data={listData} />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <Tags data={tagDatas} />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>WordField</Text>
              <WordField text="canyon" />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Picker</Text>
              <Picker />
            </View>
          </ScrollView>
        </View>
      );
    }
}

export default Test1;
