import React from 'react';

import Navbar from './Components/Navbar';

import Products from './Components/Products';
import Footer from './Components/Footer';
import { Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Contact from './Components/Contact';
import Login from './Components/Login';
import "./App.css"

import Register from './Components/Register';
import Cart from './Components/Cart';
import Profile from './Components/Profile';

import AdminDashboard from './admin/AdminDashboard';


function App() {

  return (
    <div className="App">
      {/* Navbar */}
    <Navbar/>

     <Routes>
     <Route path='/' element={<Home/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/shop' element={<Products/>}/>
      <Route path='/admin' element={<AdminDashboard/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path="/profile" element={<Profile/>}/>
     </Routes>

   
      <Footer/>
    </div>
  );
}

export default App;


 


