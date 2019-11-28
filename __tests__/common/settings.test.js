import { Map } from 'immutable';

import settings from '../../src/common/settings';
import config from '../../config';

beforeEach(() => {
  settings.data = new Map(config.defaultSettings);
});

describe('settings toJson and serialize test', () => {
  test('verify settings toJson', () => {
    settings.set('language', 'en')
      .set('currency', 'USD')
      .set('fingerprint', false);
    const expectedSettings = {
      language: 'en',
      currency: 'USD',
      fingerprint: false,
    };

    expect(settings.toJson()).toEqual(expectedSettings);
  });

  test('serialize deserialize settings', async () => {
    settings.set('language', 'en')
      .set('currency', 'USD')
      .set('fingerprint', false);
    await settings.serialize();
    const settingsData = await settings.deserialize();

    const expectedData = ['en', 'USD', false];
    expect(settingsData).toEqual(expectedData);
  });
});
