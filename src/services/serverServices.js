import Parse from 'parse/lib/react-native/Parse';

const getServerInfo = async () => Parse.Cloud.run('getServerInfo', {});
const getStatus = async () => {};

export { getServerInfo, getStatus };
