import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import flex from '../../assets/styles/layout.flex';
import screenHelper from '../../common/screenHelper';
import Header from '../../components/common/misc/header';
import Button from '../../components/common/button/button';
import Loader from '../../components/common/misc/loader';


const styles = StyleSheet.create({
  safeView: {
    paddingBottom: screenHelper.bottomHeight,
  },
  buttonView: {
    alignSelf: 'center',
    paddingVertical: 15,
  },
});

const BasePageGereral = (props) => {
  const {
    children, isSafeView, title, goBack, navigation, hasBottomBtn, bottomBtnText, bottomBtnOnPress, hasLoader, isLoading, renderAccessory,
  } = props;
  return (
    <View style={[flex.flex1, isSafeView ? styles.safeView : {}]}>
      <ScrollView>
        <Header title={title} goBack={goBack || (() => navigation.goBack())} />
        <View style={[screenHelper.styles.body]}>
          {children}
        </View>
      </ScrollView>
      {hasBottomBtn && (
      <View style={[styles.buttonView]}>
        <Button text={bottomBtnText} onPress={bottomBtnOnPress || (() => null)} />
      </View>
      ) }
      {hasLoader && <Loader loading={isLoading} />}
      {renderAccessory && renderAccessory()}
    </View>
  );
};

BasePageGereral.propTypes = {
  isSafeView: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    pop: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }).isRequired,
  hasBottomBtn: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.object.isRequired,
  hasLoader: PropTypes.bool,
  renderAccessory: PropTypes.func,
  bottomBtnOnPress: PropTypes.func,
  goBack: PropTypes.func,
  bottomBtnText: PropTypes.string,
  isLoading: PropTypes.bool,
};

BasePageGereral.defaultProps = {
  goBack: null,
  bottomBtnOnPress: null,
  bottomBtnText: '',
  isLoading: false,
  renderAccessory: null,
  hasLoader: false,
};


export default BasePageGereral;
