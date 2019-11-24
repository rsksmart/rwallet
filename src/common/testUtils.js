/* eslint-disable */

import React from 'react'

export function mockComponent (componentName) {
    return (props) => {
        return (
            <mocked originalComponent={componentName} {...props}>{props.children}</mocked>
        )
    }
}

export function mockNamedComponents (componentNames) {
    const mockedComponents = {}
    for (let i = 0; i < componentNames.length; i++) {
        const name = componentNames[i];
        mockedComponents[name] = mockComponent(name);
    }
    return mockedComponents
}