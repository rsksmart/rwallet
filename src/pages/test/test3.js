import React, { Component } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import flex from '../../assets/styles/layout.flex';
import { strings } from '../../common/i18n';
import SelectionList from '../../components/common/list/selectionList';

const listData = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'ARS - Argentine Peso',
    onPress: () => {},
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'USD - US Dollar',
    onPress: () => {},
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'RMB - Chinese Yuan',
    onPress: () => {},
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d721',
    title: 'KRW - South Korea won',
    onPress: () => {},
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d722',
    title: 'JPY - Japanese Yen',
    onPress: () => {},
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d723',
    title: 'GBP - Pound Sterling',
    onPress: () => {},
  },
];

const styles = StyleSheet.create({
	text: {},
    button: {
        alignItems: 'center',
        backgroundColor: 'orange',
        padding: 12,
        width: 280,
        marginTop: 12,
    }
});

class Test3 extends Component {
    static navigationOptions = ({ navigation }) => {
        return{
            header: null,
        }
    };
    constructor(props){
        super(props);
    }
    render() {
      return (
        <View style={[flex.flex1]}>
          <Text>{strings('test3.text')}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const { navigation } = this.props;
              navigation.navigate('Setting');
            }}
          >
            <Text style={styles.text}>{strings('test3.button')}</Text>
          </TouchableOpacity>
          <View style={{ paddingHorizontal: 25 }}>
            <SelectionList data={listData} />
          </View>
        </View>
      );
    }
}
export default Test3;
