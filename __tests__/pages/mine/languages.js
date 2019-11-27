import React from 'react';
import renderer from 'react-test-renderer';

import { mockComponent } from '../../../src/common/testUtils'

import {Language} from'../../../src/pages/mine/language';
jest.mock('../../../src/components/common/misc/header', () => { return mockComponent('Icon') });

describe("Button component", () => {
    test('renders correctly', () => {
        const tree = renderer.create(<Language />).toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('onchange correctly', () => {
        const component = renderer.create(<Language changeLanguage={() => {}}/>);
        const instance = component.getInstance();
        expect(instance.state).toBe(null);
    })
});
