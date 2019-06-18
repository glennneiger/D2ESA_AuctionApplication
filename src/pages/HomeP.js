import React from 'react';
import '../css/fontawesome/css/all.css';

class HomeP extends React.Component {
  constructor(props)
    {
      super(props);
      this.state = {
        hashpwd : '',
        hashKey : '',
        piData : [],
        showPiChart : false,
        expandedSector: null,
        collapse: false,
        ShowuserHashProf : true,
        eRatng : '',
        userRegion : '',
        suryaMudra : 0,
        userHash : '',
        installedCapacity : ''
        };
    };

render() {

      return(
        <div>
        </div>
      );
    }
}

export default HomeP;
