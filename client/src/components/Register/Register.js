import React, {Component} from 'react';
import './Register.css';
import { serverUrl } from '../../App.js';


class Register extends Component {

  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
    }
  }

  onEmailInput = (event) => {
    this.setState({
      email: event.target.value
    })
  }

  onPswInput = (event) => {
    this.setState({
      password: event.target.value
    })
  }

  onNameInput = (event) => {
    this.setState({
      name: event.target.value
    })
  }

  onSubmit = () => {
    // check if form is complete
    if(this.state.email && this.state.name && this.state.password){


      ////////////////////////////////////////////////////////
      //CREATE NEW USER RECORD -> return user info -> upload app.js state.user
      fetch(`${serverUrl}/register`,
      {
        method: 'post',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
          name: this.state.name
        })
      })
      .then(response => response.json())
      .then(user => {
        if(user.id){ //check if db respond with a user --> user exist
          this.props.resetState();
          this.props.loadUser(user);
          this.props.onRouteChange('home');
        }
        else{console.log('ALERT: registration data not valid')}
      })
      .catch(err => console.log('ERROR: front-end /register error in register component'))
      

    //////////////////////////////////////////
    //CRAETE NEW SESSION RECORD -> return session info -> updata app.js state.session
    fetch(`${serverUrl}/session-post`,
    {
      method: 'post',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({
        email: this.state.email,
        last_login: new Date(),
        img_search: [],
        entries: 0,
        sessions: 1
      })
    })
    .then(response => response.json())
    .then(session => {
      if(session.email){
        this.props.loadSession(session)}
      else{console.log('session post: error')}
    })
    .catch(err => console.log('ERROR: session-post'))

    }
  }


  render(){
    return(
      <div id="signin">

        <div className="container h-100">
          <div className="d-flex justify-content-center h-100">
            <div className="user_card">

              <div className="d-flex justify-content-center">
                <div className="brand_logo_container">
                  <i className=" brand_logo fa-solid fa-robot"></i>
                </div>
              </div>

              <div className="d-flex justify-content-center form_container">
                <form>

                <div className="input-group mb-3">
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fas fa-user"></i></span>
                    </div>
                    <input type="text" name="" className="form-control input_user" placeholder="Name" onChange={this.onNameInput}/>
                  </div>

                  <div className="input-group mb-3">
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fa-solid fa-envelope"></i></span>
                    </div>
                    <input type="text" name="" className="form-control input_user" placeholder="email" onChange={this.onEmailInput}/>
                  </div>

                  <div className="input-group mb-2">
                    <div className="input-group-append">
                      <span className="input-group-text"><i className="fas fa-key"></i></span>
                    </div>
                    <input type="password" name="" className="form-control input_pass" placeholder="password" onChange={this.onPswInput}/>
                  </div>

                  <div className="form-group"></div>

                  <div className="d-flex justify-content-center mt-3 login_container">
                    <button type="button" name="button" className="btn login_btn" onClick={this.onSubmit}>Register Now</button>
                </div>

                <div className="mt-4">
                <div className="d-flex justify-content-center links">
                  <span className="plain-text">Already an account?</span>
                  <a href="#" onClick={() => this.props.onRouteChange('signin')}className="ml-2">Log In Now</a>
                </div>
              </div>

                </form>
              </div>

            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Register;