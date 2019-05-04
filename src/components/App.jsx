import React from "react";
import IntervalsContainer from "./IntervalUpdates/IntervalsContainer";
import HistoricalContainer from "./Historical/HistoricalContainer";
import DetailsContainer from "./Details/DetailsContainer";
import PlansContainer from "./Plans/PlansContainer";
import "core-js/stable";
import "regenerator-runtime/runtime";

import { Provider } from "react-redux";
import store from "../store";

var App = () => {
  return (
    <Provider store={store}>
      <React.Fragment>
        <header>Header</header>
        <div id="container">
          <div className="sub-container">
            <IntervalsContainer />
            <DetailsContainer />
          </div>
          <div className="sub-container">
            <PlansContainer />
            <HistoricalContainer />
          </div>
        </div>
      </React.Fragment>
    </Provider>
  );
};

export default App;
