import React from 'react';
import flogo from '../img/fokus.png';


class Profile extends React.Component {
  constructor(props)
  {
    super(props);
    this.logoutSubmit = this.logoutSubmit.bind(this);

    this.state = {
      showloginForm: false,
      uval : '',
      upwd : ''
      };
  };
  logoutSubmit(event)
  {
    event.preventDefault();
    this.props.parentLogoutMethod();
    
  }
  render() {
    return <div className='profile'>
              <div className="logo">
                  <img src={flogo} />
                <span> Fraunhofer Fokus </span>
              </div>
              <br/>

              <form onSubmit= { this.loginSubmit }>
              <label htmlFor="recipient-name" className="control-label">
                You are logged in as</label> <br/>
                  <label htmlFor="recipient-name" className="control-label">
                    {this.props.profilename} </label>

              </form>
           </div>
  }
}

export default Profile;
