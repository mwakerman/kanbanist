import React from 'react';
import { ConnectedRouter as Router } from 'react-router-redux';
import { Route, Switch, Link } from 'react-router-dom';
import ReactGA from 'react-ga';
import { FocusStyleManager } from "@blueprintjs/core";

import Board from './components/Board';
import Header from './containers/Header';
import Footer from './containers/Footer';

import './App.css';
import '../node_modules/@blueprintjs/core/dist/blueprint.css';

// Pages
import Issues from './pages/Issues';
import Home from './pages/Home';
import Demo from './pages/Demo';
import Donate from './pages/Donate';

// Google Analytics
ReactGA.initialize('UA-5257385-6', {
  debug: false,
  titleCase: false,
});

// Control focus outline visibility.
FocusStyleManager.onlyShowFocusOnTabs();

class App extends React.Component {

    handleLocationChange = ({pathname}) => {
        ReactGA.set({ page: pathname });
        ReactGA.pageview(pathname);
    };

    componentWillMount() {
        const { history } = this.props;
        this.unsubscribeFromHistory = history.listen(this.handleLocationChange);
        this.handleLocationChange(history.location);
    }

    componentWillUnmount() {
        if (this.unsubscribeFromHistory) this.unsubscribeFromHistory()
    }

    render() {
        const { actions, history } = this.props;
        return (
            <Router history={history}>
                <div className="App">
                    <Header history={history} />
                    <div className="main-content">
                        <Switch>
                            <Route exact={true} path="/" component={Home}/>
                            <Route path="/board" component={(props) => <Board actions={actions} {...props} />}/>
                            <Route path="/issues" component={Issues}/>
                            <Route path="/demo" component={Demo}/>
                            <Route path="/donate" component={Donate}/>

                            {/* Catch-all => 404 */}
                            <Route component={() => (<div><h1>404 Not Found</h1><Link to="/">Home</Link></div>)} />
                        </Switch>
                    </div>
                    <Footer/>
                </div>
            </Router>
        );
    }
}

export default App;
