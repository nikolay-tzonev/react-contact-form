import configData from "./config.json";
import React, { useReducer, useState } from 'react';
import './App.css';

const modelReducer = (state: any, event: any) => {
  return {
    ...state,
    [event.name]: event.value
  }
}

function App() {
  const [model, setModel] = useReducer(modelReducer, {});
  const [loading, setLoading] = useState(false);
  const [fieldColor, setFieldColor] = useState('');
  const [buttonState, setButtonState] = useState<{ front?: string, back?: string }>({});


  const onFieldChange = (event: any) => {
    setModel({
      name: event.target.name,
      value: event.target.value,
    });
  }

  const updateBorderColor = (event: any) => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    setFieldColor("#" + randomColor);
  }

  const onSubmit = (event: any) => {
    event.preventDefault();
    setLoading(true);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(model)
    };
    fetch(`${configData.apiBaseUrl}contact/validate`, requestOptions)
      .then(res =>
        setButtonState(res.ok ? { back: 'green', front: 'yellow' } : { back: 'red', front: 'blue' }))
      .catch(console.log)
      .finally(() => { setLoading(false); })
  }

  return (
    <div className="wrapper">
      <h1>Contact Validation</h1>
      <form onSubmit={onSubmit}>
        <fieldset disabled={loading}>
          <label htmlFor="firstName"><p>First name</p>
            <input type="text" id="fname" name="firstName"
              style={{ borderColor: fieldColor, borderWidth: 2 }}
              value={model['firstName'] || ''} onChange={onFieldChange} onBlur={updateBorderColor} />
          </label>
          <label htmlFor="lastName"><p>Last name</p>
            <input type="text" id="lname" name="lastName"
              style={{ borderColor: fieldColor, borderWidth: 2 }}
              value={model['lastName'] || ''} onChange={onFieldChange} onBlur={updateBorderColor} />
          </label>
          <label htmlFor="email"><p>Email</p>
            <input type="text" id="email" name="email"
              style={{ borderColor: fieldColor, borderWidth: 2 }}
              value={model['email'] || ''} onChange={onFieldChange} onBlur={updateBorderColor} />
          </label>
        </fieldset>
        <button type="submit" disabled={loading} style={{ backgroundColor: buttonState.back, color: buttonState.front }}>Submit</button>
      </form>
    </div>
  );
}

export default App;
