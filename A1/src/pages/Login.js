import React from 'react';
import '../css/style.css';
import d2esa from '../img/d2esaor.png';

class Loginapp extends React.Component {
  constructor(props)
  {
    super(props);
    this.loginSubmit = this.loginSubmit.bind(this);
    this.handleUText = this.handleUText.bind(this);
    this.handleUage = this.handleUage.bind(this);
    this.state = {
      showloginForm: false,
      showstatusMs: false,
      uval : '',
      uage : ''
      };
  };
  goTo(route) {
     this.props.history.replace(`/${route}`)
   }
  handleUText(val)
  {
    this.setState({
      uval : val
    });
  }
  handleUage(val)
  {
    this.setState({
      uage : val
    });
  }
  loginSubmit(event)
  {
    event.preventDefault();
    this.props.parentMethod(this.state.uval,this.state.uage);
    if(localStorage.getItem('status') === 'authentication failed')
    {
        this.setState(
          {
            showstatusMs: true
          }
        );
    }
    else if (localStorage.getItem('status') === 'User Not found')
    {
        this.setState(
          {
            showstatusMs: true
          }
        );
    }
  }
  render() {
    return <div className='login'>
              <div className="logo">
                  <div className = "logoImg" >
                    <img src={d2esa} className="Profile-logo" alt="logo" />
                  </div>
                  <div className = "logoText">
                      <span>         Auction Experiment </span>
                  </div>
                  <div className = "loginData">
                  <form onSubmit= { this.loginSubmit }>
                        <Input type='text' name='username' placeholder='username'
                        onInText={this.handleUText} />
                        <Input type='text' name='age' placeholder='age'
                        onInText={this.handleUage}/>
                        <button className="SignIn" > Sign In</button>
                  </form>
                  </div>
              </div>
           </div>
  }
}

class Input extends React.Component {

    constructor(props)
      {
        super(props);
        this.textChange = this.textChange.bind(this);
        this.state = {
          inText: '',
          };
      }

    textChange(event){
        this.setState({
               inText: event.target.value}
             , () => {
        this.props.onInText(this.state.inText)
      });
      }


  render() {
    return <div className='Input'>
              <input type={ this.props.type } name={ this.props.name } placeholder={ this.props.placeholder } required autoComplete='off'
                onChange={this.textChange.bind(this)}
                value={this.state.inText}/>

           </div>
         }
       }

export default Loginapp;
