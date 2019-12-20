import { Map } from 'immutable';

import settings from '../../src/common/settings';
import config from '../../config';

beforeEach(() => {
  settings.data = new Map(config.defaultSettings);
});

describe('settings toJson and serialize test', () => {
  test('verify settings toJson', () => {
    settings.set('language', 'zh')
      .set('currency', 'CNY')
      .set('fingerprint', true);
    const expectedSettings = {
      language: 'zh',
      currency: 'CNY',
      fingerprint: true,
    };

    expect(settings.toJson()).toEqual(expectedSettings);
  });

  test('serialize deserialize settings', async () => {
    settings.set('language', 'zh')
      .set('currency', 'CNY')
      .set('fingerprint', true);
    await settings.serialize();
    const settingsData = await settings.deserialize();

    const expectedData = ['zh', 'CNY', true];
    expect(settingsData).toEqual(expectedData);
  });
});
