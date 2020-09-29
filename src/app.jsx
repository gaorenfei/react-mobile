import React from "react";
import Routers from "./routes";
import "styles/app.less"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="app">
        <Routers />
      </div>
    );
  }
}

export default App;