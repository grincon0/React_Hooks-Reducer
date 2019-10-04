import React, { useState } from 'react';
import LoadingIndicator from '../UI/LoadingIndicator';
import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {
  //array with 2 value
  //[0] = state
  //[1] = function
  //const [inputState, setInputState] = useState({ title: '', amount: '' })

  //tehese state survive re-render cycles

  //RULE 1: You can only use hooks in functional componenets or other hooks
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngredient({title: enteredTitle, amount: enteredAmount});
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" value={enteredTitle} onChange={event => {
              setEnteredTitle(event.target.value);
            }} 
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" value={enteredAmount} onChange={event => {
              setEnteredAmount(event.target.value);
            }}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.isLoading && <LoadingIndicator/>}
          </div>
          
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
