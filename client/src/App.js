import './App.css';
import {Routes, Route, Link} from 'react-router-dom';
import Main from './views/Main';
import 'bootstrap/dist/css/bootstrap.min.css';
import Landing from './views/Landing';
import Account from './views/Account';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Main />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </div>
  );
}
export default App;
