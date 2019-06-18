import history from '../history';
import React from 'react';
import io from "socket.io-client";

class Authorize extends React.Component {

  constructor(props) {
    super(props);
    this.handleAutherization = this.handleAutherization.bind(this);
    this.sesSet = this.sesSet.bind(this);
    this.sessDelete = this.sessDelete.bind(this);
    this.socket = io('10.42.0.1:8080');

    var self = this;
    this.socket.on('RECEIVE_MESSAGE', function(data){
          var dt = data.split('_');
          if (dt[0] === "1"){
            localStorage.setItem('status','authentication succeeded');
            localStorage.setItem('user',dt[1]);
            self.sesSet();
          }
          else {
            window.confirm('Please enter correct details');
          }
        });
   }

  sesSet(responsecode) {
    var currentTime = new Date() ;
    let expireTime = JSON.stringify(currentTime.getTime() + 30*60*1000);
    localStorage.setItem('expireTime', expireTime);
    history.replace('/home');
    }
  profileName(){
      return localStorage.getItem('user');
  }
  checkAuthenticated() {
    let expireTime = JSON.parse(localStorage.getItem('expireTime'));

    return new Date().getTime() < expireTime;
  }

  handleAutherization(uval,upwd){

  this.socket.emit('SEND_MESSAGE', {
            cid : uval,
            cage :upwd,
            cit:"1"
          });
        }
 sessDelete() {

  localStorage.removeItem('user');
  localStorage.removeItem('expireTime');
  history.replace('/');
   }

}
export default Authorize;
