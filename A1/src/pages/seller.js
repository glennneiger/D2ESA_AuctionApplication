import io from "socket.io-client";
import React from 'react';
import '../css/select.css';
import Select from 'react-select';
import '../css/style.css';
var options = [];
options.push({ value: 'EC1', label: 'EC1' });
options.push({ value: 'EC2', label: 'EC2' });
options.push({ value: 'EC3', label: 'EC3' });
class SellerStart extends React.Component {
constructor(props)
    {
      super(props);

      this.state = {
          echargeStation : 'EC1',
          ebaseprice : 0,
          esecretkey : '',
          invalidley : '',
          showSubmitButton : true
      };

      var self = this;
      this.csChange = this.csChange.bind(this);
      this.handlescrectkey = this.handlescrectkey.bind(this);
      this.handlebaseprice = this.handlebaseprice.bind(this);
      this.SubmitSlot = this.SubmitSlot.bind(this);
      this.socketBM1 = io('141.44.201.91:4451');
      this.socketBM2 = io('141.44.201.91:4452');
      this.socketBM3 = io('141.44.201.91:4453');
      this.socketBM1.on('ACTIVATE_SLOT', function(data){
                          self.setState({
                          invalidkey : 'Auction for EC1 has ended'});
              });
      this.socketBM2.on('ACTIVATE_SLOT', function(data){
                          self.setState({
                          invalidley : 'Auction for EC2 has ended'});
                      });
      this.socketBM3.on('ACTIVATE_SLOT', function(data){
                          self.setState({
                          invalidley : 'Auction for EC3 has ended'});
                              });
      this.socketBM1.emit('AUCTION_STATUS', {data :'check status'}, (data) => {
                                  if(data)
                                  {
                                    this.setState({
                                      showSubmitButton : false,
                                      invalidley : 'Currently an Auction is in Progress'
                                    })
                                  }
                                  else {
                                    this.setState({
                                      showSubmitButton : true,
                                      invalidley : 'Please enter the base price'
                                    })
                                  }
                              });

}

csChange(revent){
  var  csva = revent === null ? 'EC1' : revent.value
  if (csva === 'EC1')
  {
    var socketIB = io('141.44.201.91:4451');
    socketIB.emit('AUCTION_STATUS', {data :'check status'}, (data) => {
        if(data)
        {
          this.setState({
            showSubmitButton : false,
            invalidley : 'Currently an Auction is in Progress'
          })
        }
        else {
          this.setState({
            showSubmitButton : true,
            invalidley : 'Please enter the base price'
          })
        }
    });
  }
  if (csva === 'EC2')
  {
    var socketIB = io('141.44.201.91:4452');
    socketIB.emit('AUCTION_STATUS', {data :'check status'}, (data) => {
        if(data)
        {
          this.setState({
            showSubmitButton : false,
            invalidley : 'Currently an Auction is in Progress'
          })
        }
        else {
          this.setState({
            showSubmitButton : true,
            invalidley : 'Please enter the base price'
          })
        }
    });
  }
  if (csva === 'EC3')
  {
    var socketIB = io('141.44.201.91:4453');
    socketIB.emit('AUCTION_STATUS', {data :'check status'}, (data) => {
        if(data)
        {
          this.setState({
            showSubmitButton : false,
            invalidley : 'Currently an Auction is in Progress'
          })
        }
        else {
          this.setState({
            showSubmitButton : true,
            invalidley : 'Please enter the base price'
          })
        }
    });
  }
  //this.socketBAM.emit('newSlot', message);
  this.setState({
    echargeStation: csva});
}
handlebaseprice(val){
  this.setState({
    ebaseprice: val});
}
handlescrectkey(val){
  this.setState({
    esecretkey: val});
}
SubmitSlot(revent){
  revent.preventDefault();
  var sv = this.state.esecretkey;
  var bpc = this.state.ebaseprice;
  var ecs = this.state.echargeStation;
    if (ecs === 'EC1')
    {
        if (sv === 'e1')
        {
          console.log( )
          if(isNaN(bpc/0))
          {
            this.setState({
              invalidley : 'Please enter an integer value'});
          }
          else {

            this.setState({showSubmitButton : false,
            invalidley : 'Auction is in Progress'});
            this.socketBAM = io('141.44.201.91:4451');
            var message = bpc
            this.socketBAM.emit('newSlot', message);
          }

        }
        else
        {
            this.setState({
              invalidley : 'Invalid Key'});
        }
    }
    else if (ecs === 'EC2')
    {
      if (sv === 'e2')
      {
        console.log( )
        if(isNaN(bpc/0))
        {
          this.setState({
            invalidley : 'Please enter an integer value'});
        }
        else {

          this.setState({showSubmitButton : false,
          invalidley : 'Auction is in Progress'});
          this.socketBAM = io('141.44.201.91:4452');
          var message = bpc
          this.socketBAM.emit('newSlot', message);
        }

      }
      else
      {
          this.setState({
            invalidley : 'Invalid Key'});
      }
    }
    else if (ecs === 'EC3')
    {
      if (sv === 'e3')
      {
        console.log( )
        if(isNaN(bpc/0))
        {
          this.setState({
            invalidley : 'Please enter an integer value'});
        }
        else {

          this.setState({showSubmitButton : false,
          invalidley : 'Auction is in Progress'});
          this.socketBAM = io('141.44.201.91:4453');
          var message = bpc
          this.socketBAM.emit('newSlot', message);
        }

      }
      else
      {
          this.setState({
            invalidley : 'Invalid Key'});
      }
    }
}

render() {
return(
    <div>
    <table className = "sellerTable">
    <tbody>
    <tr>
    <td>
    <table className = "stSUper">
    <tbody>
    <tr>
    <td className = "st1">
    </td>
    <td className = "sellerDropDown">
    <Select  name="sellerChange"
                        value={this.state.echargeStation}
                        options={options}
                        onChange={this.csChange}  />
    </td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    <tr className = "basePriceFrame">
      <div className = "BloginData">
        <form onSubmit= { this.SubmitSlot }>
              <Input type='text' name='baseprice' placeholder='baseprice'
              onInText={this.handlebaseprice} />
              <Input type='text' name='secretkey' placeholder='secretkey'
              onInText={this.handlescrectkey} />
              <div>
              {
                this.state.showSubmitButton ?
              <div>
                <button className="SignIn" > Submit Bid</button>
              </div> :
              null
            }
              </div>
              </form>
      </div>
    </tr>
    <tr  className = "invalidKeyClass">
    <td>
    <p>{this.state.invalidley} </p>
    </td>
    </tr>
    </tbody>
    </table>
    </div>
    );
  }
};

class Input extends React.Component {
 constructor(props){
        super(props);
        this.textChange = this.textChange.bind(this);
        this.state = {
          inText: ''
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
export default SellerStart;
