import React from 'react';
import { FlatList } from 'react-native';
import { PropTypes } from 'prop-types';
import WarningCard from 'mellowallet/src/components/WarningCard';
import { t } from 'mellowallet/src/i18n';
import { Text, ListItem } from 'native-base';

class CurrencyList extends React.PureComponent {
  renderEmptyListComponent = () => {
    const { isLoading } = this.props;
    return !isLoading
      && (
        <WarningCard
          color="#17EAD9"
          iconName="error-outline"
          message={t('There are not currencies available yet.')}
        />
      );
  };

  renderCurrencytItem = ({ item }) => {
    const { onChangeCurrencyPress } = this.props;
    return (
      <ListItem onPress={() => onChangeCurrencyPress(item.key)}>
        <Text>{t(item.value)}</Text>
      </ListItem>
    );
  }

  render() {
    const { currencies } = this.props;
    return (
      <FlatList
        data={currencies}
        renderItem={this.renderCurrencytItem}
        ListEmptyComponent={this.renderEmptyListComponent}
      />
    );
  }
}

CurrencyList.propTypes = {
  currencies: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string,
  })),
  isLoading: PropTypes.bool,
  onChangeCurrencyPress: PropTypes.func,
};

CurrencyList.defaultProps = {
  currencies: [],
  isLoading: true,
  onChangeCurrencyPress: null,
};

export default CurrencyList;
