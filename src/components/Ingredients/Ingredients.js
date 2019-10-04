import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

//reducer function is decoupled from the functional componenet
const ingredientReducer = (currenIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currenIngredients, action.ingredient];
    case 'DELETE':
      return currenIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!')
  }
}
const Ingredients = () => {
  /* const [userIngredients, dispatch] = useReducer(ingredientReducer, []) */
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  //after and for every erender cycle, useEffect will get executed
  //seoncd arge of useEffect
  // [] = useEffect will behave like compoenentDidMount
  // useEffect by defualt behave like compoenentDidUpdate
  //second arg is meant to set a dependencies for useEffect, if the dependency's value changes, useEffect will run.

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);

  }, [userIngredients])

  const addIngredientsHandler = ingredient => {
    setIsLoading(true);
    //send new ing to firebase, get response Data with id, then save ingeredent and newly generetaed id to ing array state
    fetch('(SET-FIREBASE-DB-URL)/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      setIsLoading(false);
      return response.json();
    }).then(responseData => {
      setUserIngredients(prevIngres => [
        //copy over all previus records
        ...prevIngres,
        //add prop 'id' to new ingredient
        { id: responseData.name, ...ingredient }
      ])
    });
  }


  const removeIngredientsHandler = ingredient => {
    setIsLoading(true);
    fetch(`(SET-FIREBASE-DB-URL)/ingredients/${ingredient}.json`, {
      method: 'DELETE',

    }).then(responseData => {
      setIsLoading(false);
      setUserIngredients(userIngredients.filter(ing => ing.id !== ingredient));
    }).catch((error) => {
      setError('Something is wrong, please try again later');
      setIsLoading(false);
    })
  }

  //callback caches your wrapper event after render cycles
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);

  const clearError = () => {
    setError(false);

  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm isLoading={isLoading} onAddIngredient={addIngredientsHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} ingredients={userIngredients} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={(id) => { removeIngredientsHandler(id) }} />
      </section>
    </div>
  );
}

export default Ingredients;
