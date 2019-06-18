import io from "socket.io-client";
import React from 'react';
import '../css/fontawesome/css/all.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../css/style.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
let order = 'desc';
class EC1Page extends React.Component {
 constructor(props)
    {
      super(props);
      this.BidSubmit = this.BidSubmit.bind(this);
      this.handleBidAmount = this.handleBidAmount.bind(this);

      this.state = {
            dataRows : [],
            auctionNotification :'Currently no auctions are open',
            auctionCounter : '',
            showAuctionPortal : false,
            showloginForm: false,
            showstatusMs: false,
            bidamount : '',
            current_second_bid : '',
            hostname : '',
            port : '',
            c_id : ''
      };
      this.socket = io('10.42.0.1:8080');
      this.socket.on('EC1_RECEIVE_MESSAGE', function(data){
                   var inDataList = [];
                   var djd = data.split('$');

                   var lf = djd.length;
                   for (var i = 0; i < lf;i++){
                      inDataList.push((JSON.parse((djd[i]))));
                   }
                   self.setState({
                              dataRows:inDataList
                   });
                   var jobject = JSON.parse(djd[0]);
                   self.setState({
                      hostname :jobject.HOST,
                      port : jobject.EC1
                   });

                });
            var self = this;
      console.log(this.state.hostname);
      this.socketBM = io(this.state.hostname+':'+4451);
      console.log(this.socketBM);
      this.socketBM.on('AUCTION_START_NOTIFICATION', function(data){
                          self.setState({auctionNotification : data.data,
                                    current_second_bid : data.current_second_bid}); //  }
                                                  });
      this.socketBM.on('AUCTION_STOP_NOTIFICATION', function(data){
             self.setState({showAuctionPortal : false,auctionNotification : data.data,
             current_second_bid : '',
           lowerBidstatus : ''});
                        });
      this.socketBM.on('AUCTION_COUNTER', function(data){
             self.setState({
                          auctionCounter : data.counter,showAuctionPortal : true,
                          auctionNotification : data.data,current_second_bid : data.current_second_bid
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
handleBtnClick = () => {
  if (order === 'desc') {
    this.refs.table.handleSort('asc', 'name');
    order = 'asc';
  } else {
    this.refs.table.handleSort('desc', 'name');
    order = 'desc';
  }
}
handleBidAmount(val){
      this.setState({
        bidamount : val
      });
    }
 BidSubmit(event){
      event.preventDefault();

      if (this.state.bidamount <= this.state.current_second_bid){
        this.setState({
            lowerBidstatus :  'Your bid is lower'
        });
      }
      else {
        var message = this.state.bidamount +  "$" + localStorage.getItem('user');
        this.setState({
            lowerBidstatus :  'Your bid is updated'
        });
        this.socketBAM = io(this.state.hostname+':'+this.state.port);
        this.socketBAM.emit('newBid', message);
      }

    }
 render() {
   const options = {
     sizePerPageList: [ {
  text: 'All', value: 5
}],
        paginationSize: 3,
  sizePerPage: 5 }

      return(
        <div>
        <table className = "ECBody">
        <tbody>
        <tr>
           <td className = "ECLeft">

                <BootstrapTable data={this.state.dataRows}  scrollTop={'Bottom'}
                options={ { noDataText: 'This is custom text for empty data' } }
                striped={true}
                exportCSV
                pagination ={true}
                options = {options}>
                    <TableHeaderColumn width={'25%'}
                       headerAlign = 'center' dataAlign  = 'center' dataField='slot_id' >Slot ID</TableHeaderColumn>
                    <TableHeaderColumn width={'25%'}
                       headerAlign = 'center' dataAlign  = 'center'  dataField='no_bidders' >Number of Bidders</TableHeaderColumn>
                    <TableHeaderColumn width={'25%'}
                          headerAlign = 'center' dataAlign  = 'center'  dataField='c_id' >User Hash</TableHeaderColumn>
                    <TableHeaderColumn width={'25%'}
                       headerAlign = 'center' dataAlign  = 'center'  dataField='current_Highest_bid' isKey={ true }  dataSort={ true }>Winning Bid</TableHeaderColumn>
                    </BootstrapTable>
          </td>
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
                                        <p>Count Down Timer</p>
                                        <p>{this.state.auctionCounter}</p>
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
                            <p>{this.state.lowerBidstatus}</p>
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
                            {
                              this.state.showAuctionPortal ?
                                    <div className="BidFrame">
                                                  <div className = "BlogoText">
                                                      <p> Please enter a BID greater than</p>
                                                      <p> Displayed Amount</p>
                                                  </div>
                                                  <div className = "BloginData">
                                                    <form onSubmit= { this.BidSubmit }>
                                                          <Input type='text' name='Bid Amount' placeholder='bid amount'
                                                          onInText={this.handleBidAmount} />
                                                          <button className="SignIn" > Submit Bid</button>
                                                    </form>
                                                  </div>
                                    </div>
                                    :
                              null
                            }
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
