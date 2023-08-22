import React, { Component } from 'react';
import Menu from './components/Menu/Menu.js';
import Main from './components/Main/Main.js';
import Footer from './components/Footer/Footer.js';
import Background from './components/Background/Background.js'
import Signin from './components/Signin/Signin.js';
import Register from './components/Register/Register.js';

// css
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

//global var
let input = '';

//server environment
export let serverUrl;
const serverPort = 9000;
const serverLive = "https://face-recognition-server-ii6i.onrender.com";
const serverLocal = `http://localhost:${serverPort}`

const  appEnv = process.env.NODE_ENV || 'development';
const serverUrlbuilder = () => {
  if(appEnv === 'development' ){
    serverUrl = serverLocal
  }else{
    serverUrl = serverLive
  }
};

serverUrlbuilder();
console.log('ALERT - app running on server: ', serverUrl);


// CLRAIFAI API NEW 
const PAT = '87a0584c90e64c87869205181c5b18a7';
const USER_ID = 'thelore_85';       
const APP_ID = 'biometrics';
const MODEL_ID = 'face-detection';
let IMAGE_URL = '';
 
///////////////////////////////////////////////
////////---------COMPONENT ------------////////
///////////////////////////////////////////////


////////////////////////////////////
// Constructor

const initialState = {
      url: '',
      boxCoordinates: {},
      route: 'signin',
      isSignIn: false,
      user: {
          id: '',
          name: '',
          email: '',
          joined: '',
        },
      session: {
        email: '',
        entries: 0,
        sessions: 1,
        last_login: 1,
        img_search: [],
        sessions: 0,
      }
    }

class App extends Component{
  
  //set the constructor
  constructor(){
    super();
    this.state = initialState;
  }

  // API call: Image recognition
  onSearchClick = () => {

    //update state with image info
    this.setState({
      url: IMAGE_URL,
    })
  
    // set clarifai api variables
    const raw = JSON.stringify({
      "user_app_id": { "user_id": USER_ID, "app_id": APP_ID},
      "inputs": [{ "data": { "image": {"url": IMAGE_URL}}}]
    });

    const requestOptions = {  
      method: 'POST', 
      headers: { 'Accept': 'application/json','Authorization': 'Key ' + PAT },
      body: raw
    };

    //run api prediction
     fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
      .then(response => {
        if(response.ok){
          this.uploadSession();
          return response.text()
        }else{
          console.log('ALERT: API response invalid')
        }
      })
      .then(result => this.faceDetection((this.calculateFaceBox(JSON.parse(result)))))// returning the prediction and the sqaure details
      .catch(error => console.log('ERROR: CLARIFY API:', error)); 

  }

  //reset state after new user login
  resetState = () => {
    this.setState( initialState )
  }

  ////////////////////////////////
  // set state with face box coordinates
  faceDetection = (box) => { 
    this.setState({
      boxCoordinates: box,
    })
  }

  // calculate face box coordinates
  calculateFaceBox = (predictionObj) => { 
    const coordinates = predictionObj.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('input-image');
    const width = Number(image.width);
    const height = Number(image.height);
    const left = coordinates.left_col * width;
    const right = coordinates.right_col * width;
    const top = coordinates.top_row * height;
    const bottom = coordinates.bottom_row * height;
  
    //return 'box' for 'faceDEtection' function;
    return { 
      left: coordinates.left_col * (width),
      right: width - (coordinates.right_col * width),
      top: (coordinates.top_row * height),
      bottom: height - (coordinates.bottom_row * height),
      
      // calculate box dimention
      width: right-left,       // in %, right-left  = (60%-30%) = 30% 
      height: bottom-top,      // in %, bottom-top  = (80%-60%) = 20%
    }
  }

  onInputChange = (event) => {
    IMAGE_URL = event.target.value;
  };

  //ROUTING management
  onRouteChange = (newRoute) => {

    //SET newRoute parameter after click interaction
    this.setState({ 
      route: newRoute
    })

    // assign isSignIn state based on newRoute parameter (click interaction)
    if(newRoute === 'signin' || newRoute === 'register'){
      this.setState({
        isSignIn: false
      })
    }else{
      this.setState({
        isSignIn: true
      })
    }
  }

  //get data from register component and push to state
  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        joined: data.data_creation,
        sessions: data.sessions
      }  
    });
  }

  // UPDATE session state with url search AND update DB with new session data
  uploadSession = () => {
  
    // delate last img in the array
    if(this.state.session.img_search.length >=10){
      this.state.session.img_search.pop();
    }
  
    // add img on top of the img_search array
    this.state.session.img_search.unshift(IMAGE_URL); 
  
    //update entries value
    let newEntries = Number(this.state.session.entries) + 1

  
    //send the new session state to the db
    fetch(`${serverUrl}/session-update`,
      {
        method: 'put',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
          email: this.state.user.email,
          last_login: new Date(),
          img_search: this.state.session.img_search,
          entries: newEntries
        })
      })
      .then(response => response.json())
      .then(session => this.loadSession(session))
    }

  //get data from server: session-update / session-post and update App.js state
  loadSession = (data) => {    
    this.setState({
      session: {
        email: data.email,
        entries: data.entries,
        last_login: new Date(data.last_login).toLocaleDateString('it-IT'),
        img_search: data.img_search
      }
    })
  }

  // on load page
  componentDidMount(){  
  }

  // RENDER THE COMPONENT
	render(){
    // console.log( 'user:', this.state.user)
    // console.log( 'session:', this.state.session)
		return(
      
			<div className='app-container'>
				<Menu onRouteChange={this.onRouteChange} isSignIn={this.state.isSignIn} server={serverUrl}/>
				<Background />
        { this.state.route === 'home'
          ? <Main user={this.state.user} session={this.state.session} onSearchClick={this.onSearchClick} onInputChange={this.onInputChange} url={this.state.url} box={this.state.boxCoordinates}/>
          : (
            this.state.route === 'signin'
            ?<Signin loadUser={this.loadUser} loadSession={this.loadSession} onRouteChange={this.onRouteChange} resetState={this.resetState}/>
            :<Register loadUser={this.loadUser} loadSession={this.loadSession} onRouteChange={this.onRouteChange} resetState={this.resetState}/>
          )
        }
				  <Footer />
			</div>
		)
	}
}

export default App