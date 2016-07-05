import React from 'react';
import {
    View,
    Navigator,
    Text
} from 'react-native';
import Backlog from './components/backlog.js';

import { Provider } from 'react-redux';
import PMTstore from 'project-management-tool-redux';

var routes = {
    backlog: Backlog
}

export default class App extends React.Component {
    renderScene(route, navigator) {
        var Component = routes[route.name];
        return <Component route={route} navigator={navigator} />;
    }

    render() {
        return (
            <Provider store={PMTstore}>
                <Navigator
                    initialRoute={{
                        name: 'backlog'
                    }}
                    renderScene={this.renderScene}
                />
            </Provider>
        );
    }
}
