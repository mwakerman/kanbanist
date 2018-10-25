import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Dialog, InputGroup, Intent } from "@blueprintjs/core";
import Todoist from "../todoist-client/Todoist";
import { actions as userActions } from "../redux/modules/user";
import { actions as listActions } from "../redux/modules/lists";

class LoginDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiTokenField: "",
      loginIntent: Intent.PRIMARY,
      loading: false
    };
  }

  handleLogin = () => {
    this.setState(
      {
        loading: true
      },
      () => {
        Todoist.getUser(this.state.apiTokenField)
          .then(res => {
            if (res.error) {
              console.warn("could not login user:", res);
              this.setState({
                loading: false,
                loginIntent: Intent.DANGER
              });
            } else {
              this.setState({ loading: false }, () =>
                this.props.login(res.user)
              );
            }
          })
          .catch(err => {
            console.error("could not get user:", err);
            this.setState({
              loading: false,
              loginIntent: Intent.DANGER
            });
          });
      }
    );
  };

  render() {
    return (
      <Dialog
        autoFocus={true}
        canEscapeKeyClose={false}
        canOutsideClickClose={false}
        enforceFocus={true}
        isCloseButtonShown={false}
        iconName="log-in"
        isOpen={!this.props.loggedIn}
        title="Login"
      >
        <div className="pt-dialog-body">
          <p>Please enter your Todoist API token below.</p>
          <p className="small-text">
            Your <strong>API token</strong> can be found in Todoist Settings
            under the{" "}
            <a
              href="https://todoist.com/Users/viewPrefs?page=integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Integrations menu
            </a>.<br />
            Note that this API token is only stored locally on your computer and
            is never sent to Kanbanist.
          </p>
          <InputGroup
            value={this.state.apiTokenField}
            intent={this.state.loginIntent}
            leftIconName="user"
            type="text"
            placeholder="API Token e.g. 2cc9d26a60a8ad40d08724d92db9ad496ae6fe20"
            onKeyPress={() => {}}
            onChange={event =>
              this.setState({ apiTokenField: event.target.value })
            }
          />
          <p className="small-text">
            If you are seeing this login screen whenever you visit Kanbanist,
            please make sure your browser is not clearing website data
            (localStorage) when you close the window.
          </p>
        </div>
        <div className="pt-dialog-footer">
          <div className="pt-dialog-footer-actions">
            <Link to="/">
              <Button text="Cancel" intent={Intent.DANGER} />
            </Link>
            <Button
              intent={Intent.PRIMARY}
              onClick={this.handleLogin}
              text="Login"
              loading={this.state.loading}
              disabled={this.state.apiTokenField.length < 40}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = () => ({
  // empty
});

const mapDispatchToProps = dispatch => {
  return {
    login: user => {
      dispatch(userActions.login(user));
      dispatch(listActions.fetchLists());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginDialog);
