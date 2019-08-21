export default (lng, key, value) => {
  if (lng !== 'en') console.warn('Hey! missing key in translations was found: ', key);
  return value;
};
