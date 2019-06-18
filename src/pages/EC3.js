import React from 'react';
import '../css/fontawesome/css/all.css';
import io from "socket.io-client";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
class EC1Page extends React.Component {
  constructor(props)
    {
      super(props);
      this.socket = io('localhost:8080');var self = this;

       this.state = {
            dataRows : []
        };
        this.socket.on('EC3_RECEIVE_MESSAGE', function(data){
                var inDataList = []
                    var djd = data.split('$')

                    for (var i = 0; i < djd.length;i++)
                    {
                        inDataList.push((JSON.parse((djd[i]))))
                    }
                  self.setState({
                      dataRows:inDataList
                  });
                  });
    };

render() {
      return(
        <div>
          <div className = "ECHeader">
          <BootstrapTable data={this.state.dataRows}
                  stripped
                  expandableRow={ this.isExpandableRow }
                   expandComponent={ this.expandComponent }
                   expandColumnOptions={ { expandColumnVisible: true,
                     expandColumnComponent: this.expandColumnComponent,
                     columnWidth: 50} }
                  tableContainerClass = "tableContainer"
                  headerContainerClass= "tableHeader"
                  >
                  <TableHeaderColumn
                    width = '150px' headerAlign = 'center' dataAlign  = 'center' dataField='slot_id' >Slot ID</TableHeaderColumn>
                  <TableHeaderColumn
                    width = '150px' headerAlign = 'center' dataAlign  = 'center'  dataField='current_Highest_bid' dataSort>Bid Price</TableHeaderColumn>
                  <TableHeaderColumn
                    width = '200px' headerAlign = 'center' dataAlign  = 'center'  dataField='slot_id' isKey={ true } dataSort>Number of Bidders</TableHeaderColumn>
                  </BootstrapTable>
          </div>
          <div className = "ECBody">
          </div>
        </div>
      );
    }
}

export default EC1Page;
