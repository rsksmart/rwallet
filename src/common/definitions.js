const txStatus = {
  PENDING: 0,
  SUCCESS: 1,
  FAILED: 2,
};

const btcTxSize = 225;
const btcPreferenceSatPerbyte = [15000, 18753, 18753];
const btcPreferenceFee = [];
for (let i = 0; i < btcPreferenceSatPerbyte.length; i += 1) {
  btcPreferenceFee.push(btcPreferenceSatPerbyte[i] * (btcTxSize / 1024));
}

const defaultErrorNotification = {
  title: 'modal.defaultError.title',
  message: 'modal.defaultError.body',
};

export default { txStatus, btcPreferenceFee, defaultErrorNotification };
