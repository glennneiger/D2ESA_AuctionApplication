import ReactDOM from 'react-dom';
import './index.css';
import { makeMainRoutes } from './route';
import registerServiceWorker from './registerServiceWorker';

const routes = makeMainRoutes();

ReactDOM.render(routes, document.getElementById('root'));
registerServiceWorker();
