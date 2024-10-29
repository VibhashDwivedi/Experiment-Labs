import React from 'react';
import { BrowserRouter , Route, Routes} from 'react-router-dom';
import Login from './components/Login';
import EventList from './components/EventList';
import Signup from './components/Signup';
import CalendarComponent from './components/Calendar';

const App = () => (
  <BrowserRouter>
    
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/calendar" element={< CalendarComponent/>} /> 
      <Route path='/signup' element={<Signup/>} />
      </Routes>
  </BrowserRouter>
);

export default App;