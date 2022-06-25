import React from "react";
import { Switch, Route } from "react-router-dom";
import axios from "axios";
import { base_url } from "./Config";

import "./App.css";

// pages
import Login from "./Pages/Login";
import Siswa from "./Pages/Siswa";
import Dashboard from "./Pages/Dashboard";
import Setting from "./Pages/Setting";
import Invoice from "./Pages/Invoice"

class App extends React.Component {
  render() {
    return (
      <div className="absolute bg-gray-200 w-full h-full">
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/siswa/:nisn" component={Siswa} />
          <Route path="/siswa" component={Siswa} />
          <Route path="/setting" component={Setting} />
          <Route path="/invoice" component={Invoice} />
        </Switch>
      </div>
    );
  }
}

export default App;
