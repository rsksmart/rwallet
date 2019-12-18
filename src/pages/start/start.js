import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, StyleSheet } from 'react-native';

import Button from '../../components/common/button/button';
import Indicator from '../../components/common/misc/indicator';

const logo = require('../../assets/images/icon/logo.png');

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
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

class StartPage extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showButton: false,
    };
  }

  async componentDidMount() {
    console.log();
    this.setState({ showButton: true });
  }

  render() {
    const { loading, showButton } = this.state;
    const { navigation } = this.props;
    let buttonView = null;
    if (showButton) {
      buttonView = (
        <View style={styles.buttonView}>
          <Button
            text="GET STARTED"
            onPress={async () => {
              this.setState({ showButton: false });
              navigation.navigate('TermsPage');
            }}
          />
        </View>
      );
    }
    return (
      <View style={styles.page}>
        <View style={styles.logo}>
          <Image source={logo} />
          <Indicator visible={loading} style={[{ marginTop: 20 }]} />
        </View>
        {buttonView}
      </View>
    );
  }
}

StartPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
};

StartPage.defaultProps = {
};

export default StartPage;
