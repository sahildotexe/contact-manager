import React, { useState,useEffect } from 'react';
import Header from './Header';
import { BrowserRouter as Router,Switch,Route } from 'react-router-dom';
import AddContact from './AddContact';
import ContactList from './ContactList';
import EditContact from './EditContact';
import api from "../api/contacts";
import {uuid} from 'uuidv4';
import "./App.css";
import ContactDetails from './ContactDetails';


function App() {
  const LOCAL_STORAGE_KEY = "contacts"

  const [contacts,setContacts] = useState([]);
  const [search,setSearch] = useState([]);
  const [searchResults,setSearchResults]= useState([]);

  //Retrieve COntacts
  const retrieveContacts = async () => {
     const response = await api.get("/contacts");
     return response.data;
  }

  const addContactHandler = async (contact) => {
    console.log(contact);
    const request = {
      id: uuid(),
      ...contact
    }

    const response = await api.post("/contacts",request)

    setContacts([...contacts,response.data]);
  }

  
  const updateContactHandler = async  (contact) => {
     const response = await api.put(`/contacts/${contact.id}`,contact);
     const {id,name,email} =  response.data;
     setContacts(contacts.map(contact => {
       return contact.id === id ? {...response.data} : contact;
     }))

  }

  const removeContactHandler =  async (id) => {
    await api.delete(`/contacts/${id}`);
     const newContactList = contacts.filter((contact) => {
        return contact.id != id;
     });

     setContacts(newContactList);
  }

  const searchHandler = (search) => {
    setSearch(search);
    if(search !== ""){
      const newContactList = contacts.filter((contact) => {
       return  Object.values(contact).join(" ").toLowerCase().includes(search.toLowerCase());
      });
      setSearchResults(newContactList);
    }
    else{
      setSearchResults(contacts);
    }
  }
    
  useEffect(() => {
    // const retrieveContacts = JSON.parse( localStorage.getItem(LOCAL_STORAGE_KEY));
    // if(retrieveContacts) setContacts(retrieveContacts);
    
    const getAllContacts = async () => {
      const allContacts = await retrieveContacts();
      if(allContacts) setContacts(allContacts);
    };

    getAllContacts();


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
        <ContactList {...props} 
        contacts= {search.length < 1 ? contacts : searchResults} 
        getContactId= {removeContactHandler}
        term = {search}
        searchKeyword= {searchHandler}
        /> 
      )}
      
      />
      <Route path= "/add" exact
      
      render = {(props) => (
        <AddContact {...props} addContactHandler={addContactHandler}/>
      )}
      />

<Route path= "/edit" exact
      
      render = {(props) => (
        <EditContact {...props} updateContactHandler={updateContactHandler}/>
      )}
      />
      
      <Route path="/contact/:id" component={ContactDetails}>

      </Route>
      
     

      </Switch>
      
    
      </Router>
    </div>
  );
}

export default App;
