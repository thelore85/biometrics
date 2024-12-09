import React from 'react';
import FaceRecognition from '../FaceRecognition/FaceRecognition.js';
import './Main.css';

const Main = ({ user, session, onSearchClick, onInputChange, url, box, }) => {

  
	return(
		<section id="main">
				<h1>Face identification</h1>
				<div className="wrapper input-container">
					<input className="input" type="search" onChange={onInputChange}></input>
					<button type="button" className="btn btn-primary" onClick={onSearchClick}><i className="fas fa-search"></i></button>           
				</div>
        <FaceRecognition url={url} box={box}/>
        {/* <div className="session">
          <p>Hey {user.name}</p>
					<p>Image searched: {session.entries}</p>
					<p>Last access: {session.last_login}</p>
					<p>Image ulr:</p>
          <ol>
              {session.img_search.map((url, i) => {return <li key={i}>{url}</li>})}
          </ol>
        </div> */}
		</section>
	)
}

export default Main;