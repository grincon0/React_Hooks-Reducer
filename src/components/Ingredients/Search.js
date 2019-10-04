import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  const ingredients = props.userIngredients;
  const inputRef = useRef();

  //If you have [] as dependencies, the cleanup function runs when the componenet gets unmounted 
  useEffect(() => { 
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;

        fetch('(SET-FIREBASE-DB-URL)/ingredients.json' + query)
          .then(response => response.json())
          .then(responseData => {
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              });
            }
            console.log(loadedIngredients)
            onLoadIngredients(loadedIngredients);
          })
      }
    }, 500);
    //cleanup will run for the prvious effect before the new effect is applied
    return () => {
      clearTimeout(timer);

    }
  }, [enteredFilter, onLoadIngredients, inputRef])

  const filter = () => {
    let filtered = [];
    for (let item of ingredients) {
      if (ingredients[item.name].indexOf(enteredFilter)) {
        filtered.push({
          id: item.id,
          title: item.title,
          amount: item.amount
        });
      }
    }

    return filtered;
  }


  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={event => {
              setEnteredFilter(event.target.value)
            }}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
