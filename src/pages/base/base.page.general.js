import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import flex from '../../assets/styles/layout.flex';
import screenHelper from '../../common/screenHelper';
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
    children, isSafeView, hasBottomBtn, bottomBtnText, bottomBtnOnPress, hasLoader, isLoading, renderAccessory, headerComponent,
  } = props;
  return (
    <View style={[flex.flex1, isSafeView ? styles.safeView : {}]}>
      <ScrollView>
        {headerComponent}
        <View pointerEvents="box-none">
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
  isSafeView: PropTypes.bool,
  hasBottomBtn: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  hasLoader: PropTypes.bool,
  renderAccessory: PropTypes.func,
  bottomBtnOnPress: PropTypes.func,
  bottomBtnText: PropTypes.string,
  isLoading: PropTypes.bool,
  headerComponent: PropTypes.element.isRequired,
};

BasePageGereral.defaultProps = {
  bottomBtnOnPress: null,
  bottomBtnText: '',
  isSafeView: false,
  isLoading: false,
  renderAccessory: null,
  hasLoader: false,
};


export default BasePageGereral;
