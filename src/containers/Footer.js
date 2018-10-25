import React from "react";
import { Link } from "react-router-dom";
import { Icon, Position, Tooltip } from "@blueprintjs/core";

export default class Footer extends React.Component {
  render() {
    return (
      <div>
        <nav className="Footer pt-navbar pt-dark">
          <div className="pt-navbar-group pt-align-left">
            <a
              href="https://github.com/mwakerman/kanbanist"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="pt-button pt-minimal pt-icon-code" />
            </a>
          </div>
          <div className="pt-navbar-group pt-align-right">
            <Link to="/issues" className="hide-if-small-750">
              <button className="pt-button pt-minimal pt-icon-application">
                Known Issues
              </button>
            </Link>

            <a href="https://github.com/mwakerman/kanbanist/issues" target="_blank" rel="noopener noreferrer">
              <button className="pt-button pt-minimal pt-icon-error hide-if-small-750">
                Bugs & Feature Requests
              </button>
            </a>

            <span className="pt-navbar-divider hide-if-small-750" />
            <Tooltip
              content={`v.${process.env.REACT_APP_VERSION}`}
              position={Position.LEFT}
              on="hover"
            >
              <Icon iconName="info-sign" />
            </Tooltip>
          </div>
        </nav>
      </div>
    );
  }
}
