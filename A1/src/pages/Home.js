import React, { Component } from 'react';
import '../css/style.css';
import '../css/fontawesome/css/all.css';
import io from "socket.io-client";
import { push as Menu } from 'react-burger-menu';
import 'bootstrap/dist/css/bootstrap.css';
import EC1Page from './EC1.js';
import EC2Page from './EC2.js';
import EC3Page from './EC3.js';
import MyDetails from './MyDetails.js';
import SlotChart from './slotchart.js';
import SellerStart from './seller.js';
class Home extends Component {
constructor(props)
  {
    super(props);

    this.myEC1 = this.myEC1.bind(this);
    this.myEC2 = this.myEC2.bind(this);
    this.myEC3 = this.myEC3.bind(this);
    this.mydetails = this.mydetails.bind(this);
    this.slotchart = this.slotchart.bind(this);
    this.sellerstart = this.sellerstart.bind(this);
    this.athlogout = this.athlogout.bind(this);

    this.state = {
      showComponentEC1: false,
      showComponentEC2: false,
      showComponentEC3: false,
      showSlotChart : false,
      sellerStartShow : false,
      showComponentDetails : true
    };
}
mydetails(event)
    {
      this.setState({
        showComponentEC1: false,
        showComponentEC2: false,
        showComponentEC3: false,
        showSlotChart : false,
        sellerStartShow : false,
        showComponentDetails : true
       });
       event.preventDefault();
}
sellerstart(event)
    {
      this.setState({
        showComponentEC1: false,
        showComponentEC2: false,
        showComponentEC3: false,
        showSlotChart : false,
        sellerStartShow : true,
        showComponentDetails : false
       });
       event.preventDefault();
}
slotchart(event)
    {
      this.setState({
        showComponentEC1: false,
        showComponentEC2: false,
        showComponentEC3: false,
        showSlotChart : true,
        sellerStartShow : false,
        showComponentDetails : false
       });
       this.socket = io('141.44.201.91:8080');
       this.socket.emit('SLOT_SEND_MESSAGE', {
             cid : 't',
             cage : 't',
             cit:"5"
           });
       event.preventDefault();
}
myEC1(event)
    {
      this.setState({
        showComponentEC1: true,
        showComponentEC2: false,
        showComponentEC3: false,
        showSlotChart : false,
        sellerStartShow : false,
        showComponentDetails : false
       });
       event.preventDefault();
}
myEC2(event)
    {
      this.setState({
        showComponentEC1: false,
        showComponentEC2: true,
        showComponentEC3: false,
        showSlotChart : false,
        sellerStartShow : false,
        showComponentDetails : false
       });
       event.preventDefault();
}
myEC3(event)
    {
      this.setState({
        showComponentEC1: false,
        showComponentEC2: false,
        showComponentEC3: true,
        showSlotChart : false,
        sellerStartShow : false,
        showComponentDetails : false
       });

       event.preventDefault();
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

    <div className = "Ap13" id="outer-container">
     <Menu pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" } width={ 250 }/>
     <Menu id="page-wrap" width={ 250 } >
       <a key="0" href="" id = "a1SideMenu"  className="fa fa-user" onClick = {this.mydetails}> My Details</a>
       <a key="0" href="" id = "a1SideMenu"  className="fa fa-charging-station" onClick = {this.myEC1}> EC I</a>
       <a key="0" href="" id = "a1SideMenu"  className="fa fa-charging-station" onClick = {this.myEC2}> EC II</a>
       <a key="0" href="" id = "a1SideMenu"  className="fa fa-charging-station" onClick = {this.myEC3}> EC III</a>
       <a key="0" href="" id = "a1SideMenu"  className="fa fa-chart-line" onClick = {this.slotchart}> Slot Charts</a>
       <a key="0" href="" id = "a1SideMenu"  className="fa  fa-sellcast" onClick = {this.sellerstart}> Seller</a>
       <a key="0" href="" id = "a1SideMenu"  className="fa fa-sign-out-alt" onClick = {this.athlogout}> Logout</a>
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
                {this.state.showComponentDetails ?
                 <MyDetails /> :
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
                {this.state.showSlotChart ?
                 <SlotChart /> :
                null
                }
                {this.state.sellerStartShow ?
                 <SellerStart /> :
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
