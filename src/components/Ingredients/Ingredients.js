import React, { useReducer, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

//reducer function is decoupled from the functional componenet

//NOTE: When working with useReducer(), React will re-render the componenet whenever your reducer returns the new state

const ingredientReducer = (currenIngredients, action) => {
  switch (action.type) {
    case 'SET':
      //sets the current statenp( filter )
      return action.ingredients;
    case 'ADD':
      //takes current stateand adds to it
      return [...currenIngredients, action.ingredient];
    case 'DELETE':
      //removes an item from current state
      return currenIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
}

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...currentHttpState, loading: false }
    case 'ERROR':
      return { loading: false, error: action.errorData }
      case 'CLEAR':
        return {...currentHttpState, error: null}
    default:
      throw new Error('Should not be reached');
  }
}

const Ingredients = () => {

  const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null })
  


  //after and for every erender cycle, useEffect will get executed
  //seoncd arge of useEffect 
  // [] = useEffect will behave like compoenentDidMount
  // useEffect by defualt behave like compoenentDidUpdate
  //second arg is meant to set a dependencies for useEffect, if the dependency's value changes, useEffect will run.

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);

  }, [userIngredients])

  const addIngredientsHandler = ingredient => {
    dispatchHttp({type: 'SEND'});
    //send new ing to firebase, get response Data with id, then save ingeredent and newly generetaed id to ingrediends array state
    fetch('https://react-hooks-update-8f1c3.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      dispatchHttp({type:'RESPONSE'})
      return response.json();
    }).then(responseData => { 
      dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient } })
    });
  }


  const removeIngredientsHandler = ingredient => {
    dispatchHttp({type:'SEND'});
    fetch(`https://react-hooks-update-8f1c3.firebaseio.com/ingredients/${ingredient}.json`, {
      method: 'DELETE',

    }).then(responseData => {
      dispatchHttp({type: 'RESPONSE'});
      dispatch({ type: 'DELETE', id: ingredient })


    }).catch((error) => {
      dispatchHttp({type: 'ERROR', errorData: 'Sorry, something went wrong.'})
   
    })
  }

  //callback caches your wrapper event after render cycles
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const clearError = () => {
    dispatchHttp({type:'CLEAR'});
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm isLoading={httpState.loading} onAddIngredient={addIngredientsHandler} />
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
