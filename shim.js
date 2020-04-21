// bitcoinjs-lib, bip32 use node's globle.Buffer, globle.process
import shimBuffer from 'buffer';
import shimProcess from 'process';

// set global.Buffer = shimBuffer
if (typeof Buffer === 'undefined') global.Buffer = shimBuffer.Buffer;

// set global.process = shimProcess
if (typeof process === 'undefined') {
  global.process = shimProcess;
} else {
  const keys = Object.keys(shimProcess);
  keys.forEach((key) => {
    if (!(key in process)) {
      process[key] = shimProcess[key];
    }
  });
}
process.browser = false;
