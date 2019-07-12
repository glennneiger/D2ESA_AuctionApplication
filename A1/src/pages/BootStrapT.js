import BootstrapTable from 'react-bootstrap-table-next';

const columns = [{
  dataField: 'id',
  text: 'Product ID'
}, {
  dataField: 'name',
  text: 'Product Name'
}, {
  dataField: 'price',
  text: 'Product Price'
}];

const expandRow = {
  renderer: row => (
    <div>
      <p>{ `This Expand row is belong to rowKey ${row.id}` }</p>
      <p>You can render anything here, also you can add additional data on every row object</p>
      <p>expandRow.renderer callback will pass the origin row object to you</p>
    </div>
  )
};

export default() =>
<BootstrapTable
  keyField='id'
  data={ products }
  columns={ columns }
  expandRow={ expandRow } />
