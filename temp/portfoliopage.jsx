import React, { Component } from "react";

// React Components
// import Photo from "./Photo";
// import ProfInfo from "./ProfInfo";
// import IntroParag from "./IntroParag";
// import ValueStatement from "./ValueStatement";
// import AllIndvProjs from "./AllIndvProjs";
import KeywordFilters from "./KeywordFilters";

import { observer } from "mobx-react";

class PortfolioPage extends Component {
  render() {
    return (
      <>
        <div className="PortfolioPage">
          <KeywordFilters />
          {/* <Photo currentUser={this.props.currentUser} />
          <ProfInfo currentUser={this.props.currentUser} />
          <IntroParag currentUser={this.props.currentUser} />
          <ValueStatement currentUser={this.props.currentUser} />
          <AllIndvProjs
            currentUser={this.props.currentUser}
            fullDescProjList={this.props.fullDescProjList}
            fullDescriptionProject={this.props.fullDescriptionProject}
          /> */}
        </div>
      </>
    );
  }
}

export default observer(PortfolioPage);
