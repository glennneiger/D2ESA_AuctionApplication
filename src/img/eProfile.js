import React, { Component } from 'react';
import '../../css/font/css/font-awesome.min.css';
import PieChart from "react-svg-piechart"
import { ETHWEB_CONST } from '../../secret/ethConstants.js';
import profilePic from '../../img/0x5b669313e405a033a764f4a20f4719135b47ff42.png';
var fs = require('fs');

var Web3 = require('web3');
var web3 = new Web3("http://localhost:8545")

var smartQouteABI =  ETHWEB_CONST.smartQoute_ABI;

var smartQouteAddr = ETHWEB_CONST.smartQoute_ADDRESS;

var smartQouteContract = new web3.eth.Contract(smartQouteABI,smartQouteAddr);

class MyeProfile extends React.Component {
  constructor(props)
    {
      super(props);

      this.hashChange = this.hashChange.bind(this);
      this.hashpwdChange = this.hashpwdChange.bind(this);
      this.checkPwdDprofile = this.checkPwdDprofile.bind(this);
              this.handleMouseEnterOnSector = this.handleMouseEnterOnSector.bind(this)

      this.state = {
        hashpwd : '',
        hashKey : '',
        piData : [],
        showPiChart : false,
        expandedSector: null
        };
    };
  hashChange(event){
    event.preventDefault();
    this.setState({
      hashKey: event.target.value});
  }

  hashpwdChange(event){
    event.preventDefault();
    this.setState({
      hashpwd: event.target.value});
  }
  checkPwdDprofile(event){
    event.preventDefault();
    var hkey = this.state.hashKey
    var counterList = smartQouteContract.methods.retrieveQouteCount(hkey).call();

    var self = this;
    counterList.then(function(counterData)
      {
        console.log(counterData);
        let cLen = (counterData).length;

          self.setState({piData : [
                {label: "Sell", value: Number(counterData[1]), color: "#3b5998"},
                {label: "Sold", value: Number(counterData[2]), color: "#00aced"},
                {label: "Undecided", value: Number(counterData[0]), color: "#dd4b39"},
                {label: "Utilized", value: Number(counterData[3]), color: "#cb2027"},
              ],
              showPiChart : true
            });


      });


  }
  handleMouseEnterOnSector(sector) {
     this.setState({expandedSector: sector})
 }

render() {
      const {expandedSector} = this.state;
  return(
    <div>
              <div>
                <table>
                <tr>
                  <td>
                    <input type="text" name="amount" value ={this.hashKey}
                    onChange = {this.hashChange}/>
                  </td>
                  <td>
                    <input type="text" name="amount" value ={this.hashpwd}
                    onChange = {this.hashpwdChange}/>
                  </td>
                  <td>
                    <form onSubmit={this.checkPwdDprofile}>
                    <input   type="submit" value="Submit" />
                    </form>
                  </td>
                  <td >
                   </td>
                 </tr>
              </table>
              </div>
              <div>

                <PieChart
                    data={this.state.piData}
                    expandedSector={expandedSector}
                    onSectorHover={this.handleMouseEnterOnSector}
                    sectorStrokeWidth={2}
                    expandOnHover
                    shrinkOnTouchEnd />
              </div>
              <div>

                {
                        this.state.piData.map((element, i) => (
                            <div key={i}>
                                <span style={{background: element.color}}></span>
                                <span style={{fontWeight: this.state.expandedSector === i ? "bold" : null}}>
                                    {element.label} : {element.value}
                                </span>
                            </div>
                        ))

                }
              </div>
              {
                this.state.showPiChart ?
                <div className='eprofile'>
                  <div className='ePcircle'>
                    <img src={profilePic} />
                  </div>
                </div> :
                null
            }


      </div>)
  }
}

export default MyeProfile;
