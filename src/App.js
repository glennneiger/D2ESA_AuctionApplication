import React, { Component } from 'react';
import logo from './img/rudraimg.svg';
import './css/style.css';
import Loginapp from './pages/Login';
import 'bootstrap/dist/css/bootstrap.css';
class App extends Component {
  constructor(props)
  {
    super(props);
    this.login = this.login.bind(this);
    this.ath = this.ath.bind(this);
    this.athlogout = this.athlogout.bind(this);

      this.state = {
        showloginForm: false,
        };
    };

  goTo(route) {
     this.props.history.replace(`/${route}`)
   }
  ath(uval,upwd) {
        var th  = this.props.authorizeLogin.handleAutherization(uval,upwd);
    }

  login(event)
  {
    event.preventDefault();
    this.setState(
      {
          showloginForm: true
      }
    );
  }

  athlogout(event)
  {
    event.preventDefault();
    this.props.authorizeLogin.sessDelete();
  }

  render() {
    const { checkAuthenticated } = this.props.authorizeLogin;
    const { profileName } = this.props.authorizeLogin;


 return (
    <div className ="App">
      <div className="App-Header">
          <img src={logo} className="Header-logo" alt="logo" />
      </div>
      <div className="App-Login">
          {
            !checkAuthenticated() ?
                <Loginapp  parentMethod={this.ath} /> :
                null
          }
          {
           checkAuthenticated() && (
             <div className = "logoutCss">
                 <a key="0" href="#" id = "logoutA1"  style={{marginLeft: 72 + 'em'}} className="fa fa-sign-out"
                 aria-hidden="true" onClick = {this.athlogout}>logout{this.state.pN}</a>
            </div>
            )
          }
          {
            checkAuthenticated() &&
            (
              <label htmlFor="recipient-name" className='userProfileLabel'>
                           {profileName()} </label>
            )
          }
      </div>
    </div>

    );
  }
}


export default App;
