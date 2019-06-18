import React from 'react';
import '../css/style.css';
import d2esa from '../img/d2esa.svg';

class Loginapp extends React.Component {
  constructor(props)
  {
    super(props);
    this.BidSubmit = this.BidSubmit.bind(this);
    this.handleBidAmount = this.handleBidAmount.bind(this);
    this.state = {
      showloginForm: false,
      showstatusMs: false,
      bidamount : ''
      };
  };
  goTo(route) {
     this.props.history.replace(`/${route}`)
   }
  handleBidAmount(val)
  {
    this.setState({
      bidamount : val
    });
  }
  BidSubmit(event)
  {
    event.preventDefault();
    this.props.parentMethod(this.state.uval,this.state.uage);
    this.socketBAM = io('localhost:4451')
    this.socket.emit('newBid', this.state.bidamount);
  }
  render() {
    return <div className="BidFrame">
                  <div className = "logoText">
                      <span> New Bid </span>
                  </div>
                  <div className = "loginData">
                    <form onSubmit= { this.BidSubmit }>
                          <Input type='text' name='Bid Amount' placeholder='username'
                          onInText={this.handleBidAmount} />
                          <button className="SignIn" > Submit Bid</button>
                    </form>
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
