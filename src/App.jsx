import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useLocation,
  Navigate
} from "react-router-dom";
import Home from './pages/Home';
import YogaPoses from './pages/YogaPoses';

const App = () => {
  return (
    <Routes>
       <Route path="/" element={<Home />} />
       <Route path='/yoga' element={<YogaPoses/>}/>
    </Routes>
  )
}

export default App