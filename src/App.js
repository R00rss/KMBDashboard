import './App.css';
import { useLocation } from 'react-router-dom'
import Login from './pages/Login';

function App() {
const location = useLocation()
let validate = false
if(location.state){
  validate = location.state
}
console.log(validate)
  return (
    <div className="App">
      <Login/>  
    </div>
  );
}

export default App;
