import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Image,
    Dimensions,
    Linking,
    NativeModules,
    DeviceEventEmitter,
    Animated,
    Easing,
    Platform
} from 'react-native';
import PropTypes from 'prop-types'
import {screen} from "../../common/info";
import flex from "../../assets/styles/layout.flex";
import space from "../../assets/styles/space";

class UpdateModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showUpdate: props.showUpdate,
            isMandatory: props.mandatory,
        }
    }

    render(){
        return (
            <Modal visible={this.state.showUpdate} transparent={true} onRequestClose={()=>{}}>
                <View style={[flex.flex1, styles.container]}>
                    <View style={[space.marginBottom_5, {width: 0.8 * screen.width}]}>

                    </View>
                </View>
            </Modal>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0, right: 0, top: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        height: screen.height,
        width: screen.width,
    }
});