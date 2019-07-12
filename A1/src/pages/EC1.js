import io from "socket.io-client";
import React from 'react';
import '../css/fontawesome/css/all.css';
import '../css/style.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

class EC1Page extends React.Component {
 constructor(props)
    {
      super(props);
      this.BidSubmit = this.BidSubmit.bind(this);
      this.handleBidAmount = this.handleBidAmount.bind(this);
      this.state = {
            auctionNotification :'Currently no auctions are open',
            auctionCounter : '',
            showAuctionPortal : false,
            bidamount : 0,
            userlatestbid : 'Your latest bid is 0',
            current_second_bid : '',
      };
      var self = this;
      this.socketBM = io('141.44.201.91:4451');
      this.socketBM.on('AUCTION_START_NOTIFICATION', function(data){
                          self.setState({auctionNotification : data.data,
                                    current_second_bid : data.current_second_bid}); //  }
                                                  });
      this.socketBM.on('AUCTION_STOP_NOTIFICATION', function(data){
             self.setState({showAuctionPortal : false,auctionNotification : data.data,
             current_second_bid : '',
             userlatestbid : 'Your latest bid is 0',
           lowerBidstatus : ''});
                        });
      this.socketBM.on('AUCTION_COUNTER', function(data){
             self.setState({
                          auctionCounter : data.counter,
                          auctionNotification : data.data,
                          current_second_bid : data.current_second_bid,
                          showAuctionPortal : true
                          });
                        });
      this.socketBM.on('AUCTION_IDLE', function(data){
          self.setState({auctionNotification : data.data});});
      this.socketBM.on('AUCTION_COMPLETED_MESSAGES', function(data){
                     var inDataList = [];
                     var djd = (data.data).split('$');
                     for (var i = 0; i < djd.length;i++){
                        inDataList.push((JSON.parse((djd[i]))));
                     }
                     self.setState({
                                dataRows:inDataList
                     });
                  });
      this.socketBM.on('AUCTION_SBID_UPDATE',function(data){
            self.setState({
                current_second_bid : data.current_second_bid
            });
      });
}

handleBidAmount(val){
      this.setState({
        bidamount : val
      });
    }

BidSubmit(event){
      event.preventDefault();
      var bpc = this.state.bidamount
      if(isNaN(bpc/0)){
        this.setState({
            lowerBidstatus :  ': Please enter an integer',
            bidamount : 0
        });
      }
      else if (this.state.bidamount <= this.state.current_second_bid){
        this.setState({
            lowerBidstatus :  ': Your bid is lower',
            bidamount : 0
        });
      }
      else {
        var message = this.state.bidamount +  "$" + localStorage.getItem('user');
        this.setState({
            lowerBidstatus : ': Your bid is updated',
            userlatestbid : 'Your latest bid is ' + this.state.bidamount,
            bidamount : 0
        });
        this.socketBAM = io('141.44.201.91:4451');
        this.socketBAM.emit('newBid', message);

      }
    }

render() {
 return(
        <div>
        <table className = "ECBody">
        <tbody>
        <tr>
        <td className = "ECRight">
            <table className ="Auction">
                <tbody>
                  <tr>
                   <td>
                      <table className = "AuctionHeader">
                        <tbody>
                          <tr>
                            <td className="AuctionNotify">
                                <p>{this.state.auctionNotification}</p>
                            </td>
                            <td className = "AuctionCounter">
                                {
                                  this.state.showAuctionPortal ?
                                    <div className = "">
                                          <p>Count Down Timer : {this.state.auctionCounter}</p>
                                    </div>:
                                    null
                                  }
                            </td>
                            </tr>
                        </tbody>
                      </table>
                      </td>
                  </tr>
                  <tr>
                  <td>
                        <table className ="AuctionMiddleFrame">
                        <tbody>
                        <tr>
                          <td className ="AuctionLowerBidStatus">
                              <p> {this.state.userlatestbid} {this.state.lowerBidstatus}</p>
                          </td>
                          <td className ="AuctionCurrentHighBid">
                              <p>Second Highest Bid   {this.state.current_second_bid}</p>
                          </td>
                        </tr>
                        </tbody>
                        </table>
                  </td>
                  </tr>
                  <tr>
                    <td>
                     <table className ="AuctionDetail">
                     <tbody>
                         <tr>
                             <td>
                               <div className = "AuctionProfile">
                                      <div className="BidFrame">
                                                    <div className = "BlogoText">
                                                        <p> Please enter a BID greater than</p>
                                                        <p> Displayed Amount</p>
                                                    </div>

                                                    <div className = "BloginData">
                                                      <form onSubmit= { this.BidSubmit }>
                                                            <Input type='text' name='Bid Amount' placeholder='bid amount'
                                                            onInText={this.handleBidAmount} />
                                                            {
                                                              this.state.showAuctionPortal ?
                                                            <div>
                                                              <button className="SignIn" > Submit Bid</button>
                                                            </div> :
                                                            null
                                                          }
                                                      </form>
                                                    </div>
                                      </div>
                               </div>
                               </td>
                          </tr>
                          </tbody>
                     </table>
                     </td>
                  </tr>
                  </tbody>
              </table>
        </td>
        </tr>
        </tbody>
        </table>
        </div>
      );
    }
};


export default EC1Page;
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
