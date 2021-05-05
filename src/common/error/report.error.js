import { getSystemName } from 'react-native-device-info';
import VersionNumber from 'react-native-version-number';
import ParseHelper from '../parse';

const mockSend = (data) => {
  console.log('@jesse', data);
  Promise.resolve(true);
};

const ReportErrorToServer = ({ developerComment, errorObject }) => ParseHelper.getUser().then((parseUser) => {
  const toServerObject = {
    comment: developerComment || '',
    errorObject: errorObject.toString(),
    userId: parseUser.id,
    username: parseUser.getUsername(),
    platform: getSystemName(),
    appVersion: VersionNumber.appVersion,
  };

  // send object to server
  mockSend(toServerObject);
});

export default ReportErrorToServer;
