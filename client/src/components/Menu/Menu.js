import React from 'react';
import Logo from '../Logo/Logo.js';
import './Menu.css';


const Menu = ({ onRouteChange, isSignIn }) => {
  
  //CUSTOMER NAVIGATION
  if(isSignIn){
    return(
      <section id="menu">
        <div className="wrapper">
          <Logo />

          <div className="links">
            <a href='#'>Menu</a>
            <i className="fa-solid fa-user" onClick={() => onRouteChange('signin')}></i> 
          </div>

        </div>
      </section>
    )
    
  // PROSPECT NAVIGATION
  } else {
    return(
      <section id="menu">
        <div className="wrapper">
          <Logo />

          {/* <div className="links">
            <a href='#' onClick={() => onRouteChange('signin')} >Log-in</a>
            <a href='#' onClick={() => onRouteChange('register')} >Register</a>
          </div> */}

        </div>
      </section>
    )
  }
    
    




}

export default Menu;

