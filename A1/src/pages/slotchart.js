import io from "socket.io-client";
import React from 'react';
import '../css/fontawesome/css/all.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../css/style.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
const CSType = {
  'ec1': 'ec1',
  'ec2': 'ec2',
  'ec3': 'ec3'
};
class SlotChart extends React.Component {
constructor(props)
    {
      super(props);

      this.handleBidAmount = this.handleBidAmount.bind(this);
      this.enumFormatter =  this.enumFormatter.bind(this);
      this.state = {
            dataRows : [],
            auctionNotification :'Currently no auctions are open',
            auctionCounter : '',
            showAuctionPortal : false,
            showloginForm: false,
            showstatusMs: false,
            bidamount : '',
            userlatestbid : 'Your latest bid is 0',
            current_second_bid : '',
            hostname : '',
            port : '',
            c_id : ''
      };
      var self = this;

      this.socket = io('141.44.201.91:8080');
      this.socket.on('SLOT_RECEIVE_MESSAGE', function(data){
                   var inDataList = [];
                   var djd = data.split('$');
                   var lf = djd.length;
                   for (var i = 0; i < lf;i++){
                      inDataList.push((JSON.parse((djd[i]))));
                   }
                   self.setState({
                              dataRows:inDataList
                   });
          });
      this.socket1 = io('141.44.201.91:4451');
      this.socket1.on('SLOT_RECEIVE_MESSAGE1', function(data1){

              });
      this.socket2 = io('141.44.201.91:4452');
      this.socket2.on('SLOT_RECEIVE_MESSAGE2', function(data2){

                      });
      this.socket3 = io('141.44.201.91:4453');
      this.socket3.on('SLOT_RECEIVE_MESSAGE3', function(data3){
                                      });

}

enumFormatter(cell, row, enumObject) {
  return enumObject[cell];
}
handleBidAmount(val){
      this.setState({
        bidamount : val
      });
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
                    <TableHeaderColumn width={'10%'}
                       headerAlign = 'center' dataAlign  = 'center' dataField='slot_id'  isKey={ true }>SlotID</TableHeaderColumn>
                    <TableHeaderColumn width={'10%'}
                       headerAlign = 'center' dataAlign  = 'center'  dataField='no_bidders' >No.Bids</TableHeaderColumn>
                    <TableHeaderColumn width={'10%'}
                       headerAlign = 'center' dataAlign  = 'center'  dataField='current_Highest_bid'>WinBid</TableHeaderColumn>
                    <TableHeaderColumn width={'20%'} headerAlign = 'center' dataAlign  = 'center'
                      dataField='C_S' filterFormatted dataFormat={this.enumFormatter }
    formatExtraData={ CSType } filter={ { type: 'SelectFilter', options: CSType, defaultValue: 'ec1'} }></TableHeaderColumn>
                    </BootstrapTable>

          </td>

        </tr>
        </tbody>
        </table>
        </div>
      );
    }
};


export default SlotChart;
