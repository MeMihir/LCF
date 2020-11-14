import React, { useState } from "react";
import "./sidebar.scss";

export default function sidebar(props) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [showsidebar, setShowsidebar] = useState(false);

  return (
    <div
      className={showsidebar ? "sidebar" : "sidebarvis"}
      onClick={() => setShowsidebar(!showsidebar)}
    >
      <h1 className="header">
        {/* <img src='./rlogo.png' alt="Logo"/> */}
        LAXMI CHIT FUND
      </h1>
      <div className="Navlink" onClick={() => props.changeTable("main")}>
        All Redline
      </div>
      <div className="Navlink" onClick={() => props.changeTable("new52")}>
        New 52 Week Low
      </div>
      <div className="Navlink" onClick={() => props.changeTable("close52")}>
        Close to 52 Week Low
      </div>
    </div>
  );
}
