import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { signupUser } from '../actions/index';

// example class based component (smart component)
class Signup extends Component {
  constructor(props) {
    super(props);

    // init component state here
    this.state = {
      fullname: '',
      email: '',
      password: '',
      role: '',
      company: '',
    };

    this.changeFullName = this.changeFullName.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeRole = this.changeRole.bind(this);
    this.changeCompany = this.changeCompany.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  changeFullName(event) {
    this.setState({
      fullname: event.target.value,
    });
  }

  changeEmail(event) {
    this.setState({
      email: event.target.value,
    });
  }

  changeRole(event) {
    this.setState({
      role: event.target.value,
    });
  }

  changePassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  changeCompany(event) {
    this.setState({
      company: event.target.value,
    });
  }

  submitForm() {
    const user = {
      fullname: this.state.fullname,
      email: this.state.email,
      password: this.state.password,
      role: this.state.role,
      company: this.state.company,
    };
    this.props.signupUser(user);
  }

  renderCompany() {
    if (this.state.role !== 'recruiter') {
      return null;
    }
    return (
      <div className="companyrow">
        <div>Company</div>
        <input value={this.state.company} onChange={this.changeCompany} />
      </div>
    );
  }

  render() {
    return (
      <div className="signupbox col-md-6 col-md-offset-3">
        <div className="compname">
          <b>Sign Up</b>
        </div>
        <div className="fullnamerow">
          <div>Full Name</div>
          <input value={this.state.fullname} onChange={this.changeFullName} />
        </div>
        <div className="emailrow">
          <div>Email</div>
          <input value={this.state.email} onChange={this.changeEmail} />
        </div>
        <div className="passwordrow">
          <div>Password</div>
          <input value={this.state.password} onChange={this.changePassword} />
        </div>
        {this.renderCompany()}
        <div className="organizerrow">
          <input type="radio" name="organizer" value="organizer" onChange={this.changeRole} /> Organizer <br />
          <input type="radio" name="organizer" value="hacker" onChange={this.changeRole} /> Hacker <br />
          <input type="radio" name="organizer" value="recruiter" onChange={this.changeRole} /> Recruiter
          <br />
        </div>
        <br />
        <div className="loginbutton">
          <button className="submitjob" onClick={this.submitForm}>Submit</button>
        </div>
        <Link id="link" to="/signin">Sign In</Link>
      </div>
    );
  }
}

export default connect(null, { signupUser })(Signup);
