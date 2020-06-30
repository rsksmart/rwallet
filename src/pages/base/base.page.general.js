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
    paddingTop: 15,
    marginBottom: screenHelper.bottomButtonMargin,
    flexDirection: 'row',
  },
});

const BasePageGereral = (props) => {
  const {
    children, isSafeView, hasBottomBtn, bottomBtnText, bottomBtnOnPress, hasLoader, isLoading, renderAccessory, headerComponent,
    refreshControl, bgColor, customBottomButton,
  } = props;
  const content = (
    <View style={flex.flex1}>
      {headerComponent}
      <View style={flex.flex1}>
        {children}
      </View>
    </View>
  );
  // const WrapperView = isViewWrapper ? View : ScrollView;
  return (
    <View style={[flex.flex1, isSafeView ? styles.safeView : {}, bgColor ? { backgroundColor: bgColor } : null]}>
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={refreshControl} alwaysBounceVertical={false} bounces={false}>
        {content}
      </ScrollView>
      {!customBottomButton && hasBottomBtn && (
        <View style={[styles.buttonView]}>
          <Button text={bottomBtnText} onPress={bottomBtnOnPress || (() => null)} />
        </View>
      ) }
      { customBottomButton && (
        <View style={[styles.buttonView]}>
          {customBottomButton}
        </View>
      ) }
      {hasLoader && <Loader loading={isLoading} />}
      {renderAccessory && renderAccessory()}
    </View>
  );
};

BasePageGereral.propTypes = {
  isSafeView: PropTypes.bool,
  hasBottomBtn: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  hasLoader: PropTypes.bool,
  renderAccessory: PropTypes.func,
  bottomBtnOnPress: PropTypes.func,
  bottomBtnText: PropTypes.string,
  isLoading: PropTypes.bool,
  headerComponent: PropTypes.element,
  refreshControl: PropTypes.element,
  bgColor: PropTypes.string,
  customBottomButton: PropTypes.element,
};

BasePageGereral.defaultProps = {
  bottomBtnOnPress: null,
  bottomBtnText: '',
  isSafeView: false,
  isLoading: false,
  renderAccessory: null,
  hasLoader: false,
  headerComponent: null,
  refreshControl: null,
  bgColor: null,
  hasBottomBtn: false,
  customBottomButton: null,
};


export default BasePageGereral;
