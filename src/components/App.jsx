import React from 'react';
import IntervalsContainer from './IntervalUpdates/IntervalsContainer';
import HistoricalContainer from './Historical/HistoricalContainer';
import DetailsContainer from './Details/DetailsContainer';
import PlansContainer from './Plans/PlansContainer';
import BarChart from './Vizualizations/Chart';

import { Provider } from 'react-redux';
import store from '../store';

var App = () => {
  return (
    <Provider store={store}>
      <div id="container">
        <IntervalsContainer />
        <HistoricalContainer />
        <DetailsContainer />
        <PlansContainer />
        <BarChart />
      </div>
    </Provider>
  );
};

export default App;
