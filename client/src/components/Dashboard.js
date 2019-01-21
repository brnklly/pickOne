import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getGroups, addGroup } from "../actions/groupActions";
import Spinner from "./common/Spinner";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = () => {
    this.props.getGroups();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.errors !== this.props.errors) {
      this.setState({
        errors: this.props.errors
      });
    }
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const newGroup = {
      title: this.state.title
    };

    // close overlay if title is !empty
    if (newGroup.title.trim().length > 0) {
      this.setState({
        title: ""
      });
      this.props.closeOverlay();
    }

    this.props.addGroup(newGroup);
  };

  render() {
    const { groups, loading } = this.props.groups;
    const { errors } = this.state;

    if (loading) {
      return <Spinner />;
    }

    return (
      <main id="dashboard-page">
        <div className="overlay" id="add-group">
          <p className="heading">Add Group</p>

          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={this.state.title}
                onChange={this.onChange}
              />
              {errors.title ? (
                <div className="error">{errors.title}</div>
              ) : null}
            </div>

            <div className="buttons">
              <div className="button half" onClick={this.props.closeOverlay}>
                Cancel
              </div>
              <button className="button half" type="submit">
                Add
              </button>
            </div>
          </form>
        </div>

        {groups.length > 0 ? (
          <div className="groups">
            {groups.map((group, key) => (
              <Link to={`/group/${group._id}`} className="group" key={key}>
                <p className="title">{group.title}</p>
                <p className="arrow">
                  <i className="fas fa-angle-right" />
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="no-data">
            No groups yet. Click the button below to add one.
          </p>
        )}

        <div
          id="button-add-group"
          className="action-button btn"
          onClick={() => this.props.openOverlay("add-group")}
        >
          Add Group
        </div>
      </main>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getGroups: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  groups: state.groups
});

export default connect(
  mapStateToProps,
  { getGroups, addGroup }
)(Dashboard);
