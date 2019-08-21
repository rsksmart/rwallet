import React from 'react';
import { Linking, StyleSheet } from 'react-native';
import {
  Card,
  View,
  CardItem,
  Text,
  Icon,
  Button,
} from 'native-base';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import RemovableView from 'mellowallet/src/components/RemovableView';
import HistoryTransferCardItem from 'mellowallet/src/components/History/HistoryTransferCardItem';
import { t } from 'mellowallet/src/i18n';
import HistoryExchangeCardItem from 'mellowallet/src/components/History/HistoryExchangeCardItem';
import Wallet from 'mellowallet/src/store/models';
import LoadingCard from 'mellowallet/src/components/LoadingCard';
import moment from 'moment';
import 'moment/locale/es';
import 'moment/locale/en-au';
import { showToast, round, getLanguage } from 'mellowallet/src/utils';
import { conf } from '../../utils/constants';

const mapStateToProps = (state) => {
  const { rootReducer } = state;
  return {
    networks: rootReducer.networks,
  };
};

const styles = StyleSheet.create({
  buttonText: {
    textDecorationLine: 'underline',
  },
  icon: {
    color: 'grey',
    margin: 5,
  },
  footerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontWeight: 'bold',
  },
  timeItemView: {
    flexDirection: 'row',
  },
  row: {
    paddingTop: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingRight: 0,
    paddingLeft: 0,
    marginTop: 2,
    marginRight: 5,
    marginLeft: 5,
  },
});

class HistoryListItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showFooter: false,
      srcWallet: undefined,
      dstWallet: undefined,
      isOutput: false,
      isLoading: true,
    };
  }

  componentWillMount() {
    getLanguage()
      .then((lng) => {
        moment.locale(lng === 'es' ? 'es' : 'en-au');
      });
  }

  componentDidMount() {
    this.loadAsyncData();
  }

  loadAsyncData = async () => {
    try {
      const { historyItem } = this.props;
      const {
        src,
        dst,
        input,
        output,
      } = historyItem;
      const srcWallet = !!src && await new Wallet(src);
      const dstWallet = !!dst && await new Wallet(dst);

      const isOutput = output && !input;
      this.setState({
        isLoading: false,
        srcWallet,
        dstWallet,
        isOutput,
      });
    } catch (e) {
      this.setState({ isLoading: false });
      showToast(t('Unknown Error. Please try again.'), 'danger');
    }
  }

  onItemPress = () => {
    this.setState(prevState => ({
      showFooter: !prevState.showFooter,
    }));
  }

  renderLoadingCard = () => (
    <LoadingCard />
  )

  renderTransferItem = () => {
    const { isOutput, srcWallet, dstWallet } = this.state;
    const wallet = isOutput ? srcWallet : dstWallet;
    const { historyItem } = this.props;
    const amount = isOutput ? historyItem.output : historyItem.input;

    return (
      <HistoryTransferCardItem
        button
        network={this.props.networks[wallet.network]}
        name={wallet.name}
        primaryAmout={`${amount.fiat_unit} ${round(amount.fiat_value, conf('FIAT_DECIMAL_PLACES'))}`}
        secondaryAmount={amount.value}
        isOutput={isOutput}
        onPress={this.onItemPress}
      />
    );
  }

  renderExchangeItem = () => {
    const { srcWallet, dstWallet } = this.state;
    const { input, output } = this.props.historyItem;
    return (
      <HistoryExchangeCardItem
        button
        onPress={this.onItemPress}
        fromNetwork={this.props.networks[srcWallet.network]}
        fromAmount={input.value}
        toNetwork={this.props.networks[dstWallet.network]}
        toAmount={output.value}
      />
    );
  }

  openLink = (link) => {
    Linking.openURL(link);
  }

  renderHistoryCard = () => {
    const {
      isOutput,
      showFooter,
      srcWallet,
      dstWallet,
    } = this.state;
    const { historyItem } = this.props;
    const {
      type,
      tx_hash,
      timestamp,
    } = historyItem;
    const cardItem = type === 'exchange' ? this.renderExchangeItem() : this.renderTransferItem();
    const dateTime = moment.unix(timestamp);
    const txAddress = isOutput ? dstWallet.receive_address : srcWallet.receive_address;

    const networkHash = type === 'exchange' || isOutput ? srcWallet : dstWallet;
    return (
      <View style={styles.row}>
        <Card>
          {cardItem}
          <RemovableView hidden={!showFooter}>
            <CardItem bordered footer>
              <View style={[styles.footerView, styles.timeItemView]}>
                <Icon name="alarm" style={styles.icon} />
                <Text note numberOfLines={1}>
                  {moment(dateTime).format('llll')}
                </Text>
              </View>
            </CardItem>
            <CardItem bordered footer>
              <View style={styles.footerView}>
                <Text
                  note
                  numberOfLines={1}
                  style={styles.itemTitle}
                >
                  {`${t('Transaction Id')}:`}
                </Text>
                <Button
                  transparent
                  onPress={() => this.openLink(
                    this.props.networks[networkHash.network].get_tx_explorer_url(tx_hash),
                  )}
                >
                  <Text
                    uppercase={false}
                    numberOfLines={1}
                    style={styles.buttonText}
                  >
                    {tx_hash}
                  </Text>
                </Button>
              </View>
            </CardItem>
            <CardItem bordered footer>
              <View style={styles.footerView}>
                <Text
                  note
                  numberOfLines={1}
                  style={styles.itemTitle}
                >
                  {`${t('To Address')}:`}
                </Text>
                <Text note numberOfLines={1}>
                  {txAddress}
                </Text>
              </View>
            </CardItem>
          </RemovableView>
        </Card>
      </View>
    );
  }

  render() {
    const { isLoading } = this.state;
    return isLoading ? this.renderLoadingCard() : this.renderHistoryCard();
  }
}

HistoryListItem.propTypes = {
  historyItem: PropTypes.shape().isRequired,
  networks: PropTypes.shape({}).isRequired,
};

export default connect(mapStateToProps)(HistoryListItem);
