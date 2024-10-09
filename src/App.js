import React from 'react';
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate
import { store, persistor } from './store'; // Import the store and persistor
import './App.css';
import MyTable from './Header';
import MyTable1 from './Details';
import MyTable2 from './SlideBar';
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}> {/* Pass the store prop here */}
      
        <div className="App" style={{ display: "flex" }}>
          <div id="Main" style={{ width: "95%" }}>
            <MyTable id="myTable1"/>
            <MyTable1 id="myTable3"/>
          </div>
          <div id="myTable2">
          <MyTable2 />
          </div>
        </div>
      
    </Provider>
  );
}

export default App;
