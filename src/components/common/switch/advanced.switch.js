import React from 'react';

import {
  View, TouchableOpacity, Switch,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import PropTypes from 'prop-types';

import Loc from '../misc/loc';
import readOnlyStyles from '../../../assets/styles/readonly';

export default function AdvancedSwitch({
  style, titleStyle, value, questionPressed, onSwitchValueChanged, title, disabled,
}) {
  return (
    <View style={style || { flexDirection: 'row', alignItems: 'center' }}>
      <View style={{
        flex: 1, flexDirection: 'row', alignItems: 'center',
      }}
      >
        <Loc style={titleStyle} text={title} />
        <TouchableOpacity style={{ marginLeft: 5 }} onPress={questionPressed}>
          <AntDesign style={readOnlyStyles.questionIcon} name="questioncircleo" />
        </TouchableOpacity>
      </View>
      <Switch style={{ alignSelf: 'flex-end' }} value={value} onValueChange={onSwitchValueChanged} disabled={disabled} />
    </View>
  );
}

AdvancedSwitch.propTypes = {
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  titleStyle: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  value: PropTypes.bool,
  title: PropTypes.string,
  questionPressed: PropTypes.func,
  onSwitchValueChanged: PropTypes.func,
  disabled: PropTypes.bool,
};

AdvancedSwitch.defaultProps = {
  style: undefined,
  titleStyle: undefined,
  value: false,
  title: null,
  questionPressed: () => {},
  onSwitchValueChanged: () => {},
  disabled: false,
};
