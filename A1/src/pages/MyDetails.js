import React from 'react';
import '../css/fontawesome/css/all.css';
import io from "socket.io-client";
import '../css/style.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


class MyDetails extends React.Component {
constructor(props)
    {
      super(props);
      var self = this;
      this.state = {
            energyConsumptionNotify : '',
            amountpayable :'',
            dataRows : []
      }
      this.socket = io('141.44.201.91:8080');
      this.socket.emit('MYDETAILS_SEND_MESSAGE', {
            cid : localStorage.getItem('user'),
            cage : 't',
            cit:"6"
          },  function(data) {
            var inDataList = [];
            var djd = data.split('$');
            var lf = djd.length;
            console.log(djd);

            console.log((djd[1]));

            for (var i = 0; i < lf;i++){
              inDataList.push((JSON.parse((djd[i]))));
              }
            self.setState({
                dataRows:inDataList
            });
          });

      
    }

render()
{
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
              <p>{localStorage.getItem('user')}</p>
                <BootstrapTable data={this.state.dataRows}  scrollTop={'Bottom'}
                options={ { noDataText: 'This is custom text for empty data' } }
                striped={true}
                exportCSV
                pagination ={true}
                options = {options}>
                    <TableHeaderColumn width={'10%'}
                       headerAlign = 'center' dataAlign  = 'center' dataField='slot_id'  isKey={ true }>SlotID</TableHeaderColumn>
                    <TableHeaderColumn width={'10%'}
                       headerAlign = 'center' dataAlign  = 'center'  dataField='current_Highest_bid'>WinBid</TableHeaderColumn>
                    <TableHeaderColumn width={'20%'}
                    headerAlign = 'center' dataAlign  = 'center' dataField='amount' >Amount to be Paid</TableHeaderColumn>
                    </BootstrapTable>

          </td>

        </tr>
        </tbody>
        </table>
        </div>
      );
    }
}

export default MyDetails;
