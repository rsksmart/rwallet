import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import flex from '../../assets/styles/layout.flex';
import screenHelper from '../../common/screenHelper';
import Loader from '../../components/common/misc/loader';

const styles = StyleSheet.create({
  safeView: {
    paddingBottom: screenHelper.bottomHeight,
  },
  buttonView: {
    alignSelf: 'center',
    paddingVertical: 15,
    flexDirection: 'row',
  },
});

const BasePageSimple = (props) => {
  const {
    children, isSafeView, renderAccessory, headerComponent, bgColor, hasLoader, isLoading,
  } = props;
  const content = (
    <View style={flex.flex1}>
      {headerComponent}
      <View style={flex.flex1}>
        {children}
      </View>
    </View>
  );
  return (
    <View style={[flex.flex1, isSafeView ? styles.safeView : {}, bgColor ? { backgroundColor: bgColor } : null]}>
      <View style={flex.flex1}>
        {content}
      </View>
      {renderAccessory && renderAccessory()}
      {hasLoader && <Loader loading={isLoading} />}
    </View>
  );
};

BasePageSimple.propTypes = {
  isSafeView: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  renderAccessory: PropTypes.func,
  headerComponent: PropTypes.element.isRequired,
  bgColor: PropTypes.string,
  hasLoader: PropTypes.bool,
  isLoading: PropTypes.bool,
};

BasePageSimple.defaultProps = {
  isSafeView: false,
  renderAccessory: null,
  bgColor: null,
  hasLoader: false,
  isLoading: false,
};


export default BasePageSimple;
