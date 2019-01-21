import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { getGroup, editGroup, deleteGroup } from "../../actions/groupActions";
import {
  addChoice,
  editChoice,
  deleteChoice
} from "../../actions/choiceActions";

class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editGroupTitle: "",
      addChoiceTitle: "",
      editChoiceID: "",
      editChoiceTitle: "",
      winner: "",
      activeChoices: [],
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onEditChoiceClick = this.onEditChoiceClick.bind(this);
    this.onEditGroupSubmit = this.onEditGroupSubmit.bind(this);
    this.onAddChoiceSubmit = this.onAddChoiceSubmit.bind(this);
    this.onEditChoiceSubmit = this.onEditChoiceSubmit.bind(this);
    this.onDeleteGroupClick = this.onDeleteGroupClick.bind(this);
    this.onDeleteChoiceClick = this.onDeleteChoiceClick.bind(this);
    this.onChoiceClick = this.onChoiceClick.bind(this);

    this.onPickOneClick = this.onPickOneClick.bind(this);
    this.onBackButtonClick = this.onBackButtonClick.bind(this);
  }

  componentDidMount = () => {
    this.props.getGroup(this.props.match.params.id);
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevProps.groups !== this.props.groups &&
      this.props.groups.group !== null
    ) {
      const choices = Array.from(document.getElementsByName("choices"))
        .filter(choice => choice.checked)
        .map(choice => choice.value);

      this.setState({
        editGroupTitle: this.props.groups.group.title,
        activeChoices: choices
      });
    }

    if (prevProps.errors !== this.props.errors) {
      this.setState({
        errors: this.props.errors
      });
    }
  };

  onChoiceClick = () => {
    const choices = Array.from(document.getElementsByName("choices"))
      .filter(choice => choice.checked)
      .map(choice => choice.value);

    this.setState({
      activeChoices: choices
    });
  };

  onDeleteGroupClick = () => {
    this.props.deleteGroup(this.props.groups.group.id, this.props.history);
  };

  onDeleteChoiceClick = () => {
    this.props.deleteChoice(
      this.state.editChoiceID,
      this.props.groups.group.id
    );

    this.props.closeOverlay();
  };

  onEditChoiceClick = (id, title) => {
    this.setState({
      editChoiceTitle: title,
      editChoiceID: id
    });

    this.props.openOverlay("edit-choice");
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onEditGroupSubmit = e => {
    e.preventDefault();

    const groupData = {
      id: this.props.groups.group.id,
      title: this.state.editGroupTitle
    };

    // close overlay
    if (groupData.title.trim().length > 0) {
      this.props.closeOverlay();
    }

    this.props.editGroup(groupData);
  };

  onAddChoiceSubmit = e => {
    e.preventDefault();

    const newChoice = {
      group: this.props.groups.group.id,
      title: this.state.addChoiceTitle
    };

    // close overlay
    if (newChoice.title.trim().length > 0) {
      this.setState({
        addChoiceTitle: ""
      });
      this.props.closeOverlay();
    }

    this.props.addChoice(newChoice);
  };

  onEditChoiceSubmit = e => {
    e.preventDefault();

    const choiceData = {
      id: this.state.editChoiceID,
      title: this.state.editChoiceTitle,
      group: this.props.groups.group.id
    };

    // close overlay
    if (this.state.editChoiceTitle.trim().length > 0) {
      this.props.closeOverlay();
    }

    this.props.editChoice(choiceData);
  };

  onPickOneClick = () => {
    // randomly pick from this.state.activeChoices
    const max = this.state.activeChoices.length;

    if (max === 0) {
      // create alerts
      return;
    }

    const randomNum = Math.floor(Math.random() * max);
    // set to winner
    this.setState({
      winner: this.state.activeChoices[randomNum]
    });
    // show winner overlay
    this.props.openOverlay("winner");
  };

  onBackButtonClick = () => {
    // reset winner and close overlay
    this.setState({
      winner: ""
    });
    this.props.closeOverlay();
  };

  render() {
    const { group, loading } = this.props.groups;
    const { errors } = this.state;

    // Loading Spinner
    if (loading || group === null) {
      return null;
    }

    return (
      <main id="group-page">
        <div className="overlay" id="edit-group">
          <p className="heading">Edit Group</p>

          <form onSubmit={this.onEditGroupSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="edit-group-title"
                name="editGroupTitle"
                value={this.state.editGroupTitle}
                onChange={this.onChange}
              />
            </div>

            <div className="buttons">
              <div className="button half" onClick={this.props.closeOverlay}>
                Cancel
              </div>
              <button className="button half" type="submit">
                Submit
              </button>
            </div>
          </form>

          <div className="delete" onClick={this.onDeleteGroupClick}>
            Delete Group
          </div>
        </div>

        <div className="overlay" id="add-choice">
          <p className="heading">Add Choice</p>

          <form onSubmit={this.onAddChoiceSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="add-choice-title"
                name="addChoiceTitle"
                value={this.state.addChoiceTitle}
                onChange={this.onChange}
              />
              {errors.addChoiceTitle ? (
                <div className="error">{errors.addChoiceTitle}</div>
              ) : null}
            </div>

            <div className="buttons">
              <div className="button half" onClick={this.props.closeOverlay}>
                Cancel
              </div>
              <button className="button half" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>

        <div className="overlay" id="edit-choice">
          <p className="heading">Edit Choice</p>

          <form onSubmit={this.onEditChoiceSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="edit-choice-title"
                name="editChoiceTitle"
                value={this.state.editChoiceTitle}
                onChange={this.onChange}
              />
              {errors.editChoiceTitle ? (
                <div className="error">{errors.editChoiceTitle}</div>
              ) : null}
            </div>

            <div className="buttons">
              <div className="button half" onClick={this.props.closeOverlay}>
                Cancel
              </div>
              <button className="button half" type="submit">
                Submit
              </button>
            </div>
          </form>

          <div className="delete" onClick={this.onDeleteChoiceClick}>
            Delete Choice
          </div>
        </div>

        <div className="overlay" id="winner">
          <p className="heading">The winner is...</p>

          <p className="winner">{this.state.winner}</p>

          <div id="back-button" onClick={this.props.closeOverlay}>
            Back
          </div>
        </div>

        <h1 className="page-heading">
          <span>{group.title}</span>
          <i
            id="button-edit-group"
            className="far fa-edit"
            onClick={() => this.props.openOverlay("edit-group")}
          />
        </h1>

        {group.choices.length > 0 ? (
          <div className="choices">
            {group.choices.map((choice, key) => (
              <div className="choice" key={key} onClick={this.onChoiceClick}>
                <input
                  type="checkbox"
                  name="choices"
                  id={key}
                  value={choice.title}
                />
                <label htmlFor={key}>
                  <i className="far fa-square unchecked" />
                  <i className="far fa-check-square checked" /> {choice.title}
                </label>
                <div
                  className="button-edit-choice"
                  onClick={() =>
                    this.onEditChoiceClick(choice.id, choice.title)
                  }
                >
                  <i className="far fa-edit" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">
            No choices yet. Click the button below to add one.
          </p>
        )}

        <div className="actions">
          <div
            className="action btn"
            id="button-add-choice"
            onClick={() => this.props.openOverlay("add-choice")}
          >
            Add Choice
          </div>
          <div
            className="action btn"
            id="button-pick-one"
            onClick={this.onPickOneClick}
          >
            PickOne!
          </div>
        </div>
      </main>
    );
  }
}

Group.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  groups: PropTypes.object.isRequired,
  getGroup: PropTypes.func.isRequired,
  editGroup: PropTypes.func.isRequired,
  deleteGroup: PropTypes.func.isRequired,
  addChoice: PropTypes.func.isRequired,
  editChoice: PropTypes.func.isRequired,
  deleteChoice: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  groups: state.groups
});

export default withRouter(
  connect(
    mapStateToProps,
    { getGroup, editGroup, deleteGroup, addChoice, editChoice, deleteChoice }
  )(Group)
);
