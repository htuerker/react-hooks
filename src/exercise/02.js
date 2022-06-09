// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(
  key,
  defaultValue = '',
  {serialize = JSON.stringify, deserialize = JSON.parse} = {},
) {
  const [state, setState] = React.useState(
    () => {
      const valueFromLocalStorage = window.localStorage.getItem(key)
      if(valueFromLocalStorage) {
        return deserialize(valueFromLocalStorage)
      }
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue
    },
  )

  const prevKeyRef = React.useRef(key)

  React.useEffect(() => {
    console.log('running use effects')
    const prevKey = prevKeyRef.current
    if(prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key;
    window.localStorage.setItem(key, serialize(state))
  }, [key, state, serialize])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  console.log('renderin greeting')
  const [nameKey, setNameKey] = React.useState('name')
  const [name, setName] = useLocalStorageState(nameKey, initialName)
  const [countObject, setCountObject] = useLocalStorageState('countObject', {
    count: 0,
    timestamps: [Date.now()],
  })

  function handleChange(event) {
    setName(event.target.value)
  }

  function changeKey(event) {
    event.preventDefault()
    setNameKey('Name')
  }

  function increment(event) {
    event.preventDefault()
    setCountObject({
      count: countObject.count + 1,
      timestamps: [...countObject.timestamps, Date.now()],
    })
  }

  const {count, timestamps} = countObject
  return (
    <div>
      <form>
        <button onClick={changeKey}>Change key</button>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
        <button onClick={increment}>{countObject.count}</button>
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
      Count: {count} <br></br>
      <ol>
        timestamps:
        {timestamps &&
          timestamps.map(timestamp => <li key={timestamp}>{timestamp}</li>)}
      </ol>
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
