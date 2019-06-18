import React, { Component } from 'react';
import '../css/style.css';
import '../css/fontawesome/css/all.css';
import io from "socket.io-client";
import { push as Menu } from 'react-burger-menu';
import 'bootstrap/dist/css/bootstrap.css';
import EC1Page from './EC1.js';
import EC2Page from './EC2.js';
import EC3Page from './EC3.js';
import HomeP from './HomeP';
class Home extends Component {
  constructor(props)
  {
    super(props);

    this.myHome = this.myHome.bind(this);
    this.myEC1 = this.myEC1.bind(this);
    this.myEC2 = this.myEC2.bind(this);
    this.myEC3 = this.myEC3.bind(this);

    this.state = {
      showComponentEC1: false,
      showComponentEC2: false,
      showComponentEC3: false,
      showComponentHome : true
    };
}
myHome(event)
    {
      this.setState({
        showComponentEC1: false,
        showComponentEC2: false,
        showComponentEC3: false,
        showComponentHome : true
       });
       event.preventDefault();
}
myEC1(event)
    {
      this.setState({
        showComponentEC1: true,
        showComponentEC2: false,
        showComponentEC3: false,
        showComponentHome : false
       });
       this.socket = io('10.42.0.1:8080');
       this.socket.emit('EC1_SEND_MESSAGE', {
             cid : 't',
             cage : 't',
             cit:"2"
           });
         event.preventDefault();
}
myEC2(event)
    {
      this.setState({
        showComponentEC1: false,
        showComponentEC2: true,
        showComponentEC3: false,
        showComponentHome : false
       });
       this.socket = io('10.42.0.1:8080');
       this.socket.emit('EC2_SEND_MESSAGE', {
             cid : 't',
             cage : 't',
             cit:"3"
           });
       event.preventDefault();
}
myEC3(event)
    {
      this.setState({
        showComponentEC1: false,
        showComponentEC2: false,
        showComponentEC3: true,
        showComponentHome : false
       });
       this.socket = io('10.42.0.1:8080');
       this.socket.emit('EC3_SEND_MESSAGE', {
             cid : 't',
             cage : 't',
             cit:"4"
           });
       event.preventDefault();
}
render() {
  return (

    <div className = "Ap13" id="outer-container">
     <Menu pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" } width={ 250 }/>
     <Menu id="page-wrap" width={ 250 } >
       <a key="0" href="" id = "a1SideMenu" className="fa fa-home"  onClick = {this.myHome}> Home</a>
       <a key="0" href="" id = "a1SideMenu"  className="fa fa-charging-station" onClick = {this.myEC1}> EC I</a>
       <a key="0" href="" id = "a1SideMenu"  className="fa fa-charging-station" onClick = {this.myEC2}> EC II</a>
       <a key="0" href="" id = "a1SideMenu"  className="fa fa-charging-station" onClick = {this.myEC3}> EC III</a>
    </Menu>
     <div id = "App-Content">
         <table>
         <tbody>
         <tr className = "pageConetent">
          <td  ></td>
         </tr>
         <tr>
            <td className = "pageConetent1"></td>
             <td>
                {this.state.showComponentHome ?
                 <HomeP /> :
                null
                }
                {this.state.showComponentEC1 ?
                 <EC1Page /> :
                  null
                  }
                {this.state.showComponentEC2 ?
                 <EC2Page /> :
                null
                }
                {this.state.showComponentEC3 ?
                 <EC3Page /> :
                null
                }
                </td>
           </tr>
           </tbody>
         </table>

         </div>

  </div>
  );
}
}
export default Home;
