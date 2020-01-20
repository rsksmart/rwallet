import _ from 'lodash';
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
    children, isSafeView, title, goBack, navigation, hasBottomBtn, bottomBtnText, bottomBtnOnPress, hasLoader, isLoading, renderAccessory, customizedHeaderRightBtn, headerStyle, customHeaderComponent, customBodyMarginTop,
  } = props;
  const bodyMarginTopStyle = _.isNumber(customBodyMarginTop) ? { marginTop: customBodyMarginTop } : screenHelper.styles.body;
  return (
    <View style={[flex.flex1, isSafeView ? styles.safeView : {}]}>
      <ScrollView>
        { customHeaderComponent || (
          <Header title={title} goBack={goBack || (() => navigation && navigation.goBack())} customRightBtn={customizedHeaderRightBtn} headerStyle={headerStyle || {}} />
        ) }
        <View style={bodyMarginTopStyle}>
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
  title: PropTypes.string,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    pop: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
  }),
  hasBottomBtn: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  hasLoader: PropTypes.bool,
  renderAccessory: PropTypes.func,
  bottomBtnOnPress: PropTypes.func,
  goBack: PropTypes.func,
  bottomBtnText: PropTypes.string,
  isLoading: PropTypes.bool,
  customizedHeaderRightBtn: PropTypes.element,
  headerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  customHeaderComponent: PropTypes.element,
  customBodyMarginTop: PropTypes.number,
};

BasePageGereral.defaultProps = {
  goBack: null,
  bottomBtnOnPress: null,
  bottomBtnText: '',
  isSafeView: false,
  isLoading: false,
  renderAccessory: null,
  hasLoader: false,
  hasBottomBtn: false,
  title: '',
  customizedHeaderRightBtn: null,
  headerStyle: null,
  children: null,
  navigation: null,
  customHeaderComponent: null,
  customBodyMarginTop: null,
};


export default BasePageGereral;
