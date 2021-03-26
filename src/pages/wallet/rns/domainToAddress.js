/* eslint-disable import/prefer-default-export */
import Resolver from '@rsksmart/rns-resolver.js';

/**
 * Convert a RSK domain to address if available
 * @param {string} domain string Domain to be resolved
 * @param {string} symbol chainId to get address for
 * @param {type} constant: Mainnet or Testnet
 */
export const domainToAddress = (domain, symbol, type) => {
  console.log('getting address!!!! 00', domain, symbol, type);
  // eslint-disable-next-line new-cap
  const resolver = type === 'Mainnet' ? new Resolver.forRskMainnet() : new Resolver.forRskTestnet();
  const chainId = symbol === 'BTC' ? '0' : null;
  console.log('chainId', chainId);
  return resolver.addr(domain, chainId);
};
