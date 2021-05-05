import { getSystemName } from 'react-native-device-info';
import VersionNumber from 'react-native-version-number';
import ParseHelper from '../parse';

const mockSend = (data) => {
  console.log('@jesse, data  :', data);
  console.log('@jesse, string:', JSON.stringify(data));
  Promise.resolve(true);
};

const ReportErrorToServer = ({ developerComment, errorObject }) => ParseHelper.getUser().then((parseUser) => {
  // create the object to be sent
  const toServerObject = {
    comment: developerComment || '',
    errorObject: {
      message: errorObject.message,
      code: errorObject.code,
      stack: errorObject.stack.toString(),
    },
    userId: parseUser.id,
    username: parseUser.getUsername(),
    platform: getSystemName(),
    appVersion: VersionNumber.appVersion,
  };

  // send object to server
  mockSend(toServerObject);
});

export default ReportErrorToServer;
