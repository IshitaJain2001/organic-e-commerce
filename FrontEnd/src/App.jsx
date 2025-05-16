import React from 'react';

import Navbar from './Components/Navbar';
import AdminProducts from './admin/AdminDashboard';
import Products from './Components/Products';
import Footer from './Components/Footer';
import { Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Contact from './Components/Contact';
import Login from './Components/Login';
import "./App.css"

import Register from './Components/Register';


function App() {
  console.log(AdminProducts);
  return (
    <div className="App">
      {/* Navbar */}
    <Navbar/>

     <Routes>
     <Route path='/' element={<Home/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/shop' element={<Products/>}/>
      <Route path='/admin' element={<AdminProducts/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
     </Routes>

      {/* Featured Products */}
     {/* <Products/> */}

      {/* Footer */}
      <Footer/>
    </div>
  );
}

export default App;


 


