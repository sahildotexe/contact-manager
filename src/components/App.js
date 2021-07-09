import React, { useState,useEffect } from 'react';
import Header from './Header';
import { BrowserRouter as Router,Switch,Route } from 'react-router-dom';
import AddContact from './AddContact';
import ContactList from './ContactList';
import {uuid} from 'uuidv4';
import "./App.css";


function App() {
  const LOCAL_STORAGE_KEY = "contacts"

  const [contacts,setContacts] = useState([]);

  const addContactHandler = (contact) => {
    console.log(contact);

    setContacts([...contacts,{id: uuid(), ...contact}]);
  }

  const removeContactHandler = (id) => {
     const newContactList = contacts.filter((contact) => {
        return contact.id != id;
     });

     setContacts(newContactList);
  }



  useEffect(() => {
    const retrieveContacts = JSON.parse( localStorage.getItem(LOCAL_STORAGE_KEY));
    if(retrieveContacts) setContacts(retrieveContacts);
    },[]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));

  },[contacts])

  


  return (
    <div className="ui container">
       
      <Router>
      <Header />
      <Switch>
      <Route path= "/" exact 
      
      render = {(props) => (
        <ContactList {...props} contacts= {contacts} getContactId= {removeContactHandler}/> 
      )}
      
      />
      <Route path= "/add" exact
      
      render = {(props) => (
        <AddContact {...props} addContactHandler={addContactHandler}/>
      )}
      />
      
     

      </Switch>
      
    
      </Router>
    </div>
  );
}

export default App;
