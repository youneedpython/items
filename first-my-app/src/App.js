import logo from './logo.svg';
import React from 'react';
import './App.css';

//// local storage =======================================
const jsonLocalStorage = {
  setItem: (key, value) => {
    console.log('[jsonLocalStorage] setItem 실행됨!!!');
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    console.log('[jsonLocalStorage] getItem 실행됨!!!');
    return JSON.parse(localStorage.getItem(key));
  },
};

//// component ===========================================
function Title(props) {
  return <h1>{props.children}</h1>;
}

const Form = ({ updateMainFood }) => {
  const [value, setValue] = React.useState('');
  const hangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
  const [errorMessage, setErrorMessage] = React.useState('');

  function handlerInputChange(data) {
    const userValue = data.target.value;
    console.log(hangul(userValue));

    if (hangul(userValue)) {
      setErrorMessage('한글은 입력할 수 없습니다.');
    } else {
      setErrorMessage('');
    }

    setValue(userValue.toUpperCase());
  }

  function handlerFormSubmit(e) {
    e.preventDefault();
    setErrorMessage('');

    if (value === '') {
      setErrorMessage('빈 값으로 추가할 수 없습니다.');
      return;
    }

    updateMainFood();
  }

  return (
    <form action="" onSubmit={handlerFormSubmit}>
      <input type="text" name="name" placeholder="상품명을 입력하세요"
        onChange={handlerInputChange}
        value={value}
      />
      <button type="submit">추가</button>
      <p style={{ color: "#f00" }}>{errorMessage}</p>
    </form>
  );
};

const MainCard = ({ src, handlerHeartClick, choiceFavorite }) => {
  const heartIcon = choiceFavorite ? '💖' : '🤍';
  return (
    <div className="main-card">
      <img
        src={src}
        alt="올리브 오일"
        width="400"
        style={{ border: "1px solid #f00" }}
      />
      <button onClick={handlerHeartClick}>{heartIcon}</button>
    </div>
  );
};

const FoodItem = ({ src }) => {
  return (
    <li>
      <img
        src={src}
        alt="음식"
        style={{
          width: "150px",
          height: "100px",
          backgroundSize: "contain",
        }}
      />
    </li>
  );
};

const Favorites = ({ favorites }) => {
  return (
    <ul className="favorites">
      {favorites.map(food => (<FoodItem src={food} key={food} />))}
    </ul>
  );
};

//// App =====================================================

const App = () => {
  const foodOne = 'img/food-one.jpg';
  const foodTwo = 'img/food-two.jpg';
  const foodThree = 'img/food-three.jpg';
  const [mainFood, setMainFood] = React.useState(foodOne);
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem('favorites') || [];
  });
  const choiceFavorite = favorites.includes(mainFood);
  const [counter, setCounter] = React.useState(() => {
    console.log('counter useState 메서드 실행됨!!!')
    return jsonLocalStorage.getItem('counter');
  });

  function updateMainFood() {
    setMainFood(foodTwo);
    setCounter((pre) => {
      const nextCounter = pre + 1;
      jsonLocalStorage.setItem('counter', nextCounter);
      return nextCounter;
    });
  }

  function handlerHeartClick() {
    const nextFavorites = [...favorites, mainFood];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem('favorites', nextFavorites);
  }

  return (
    <div>
      <Title>페이지 {counter} </Title>
      <Form updateMainFood={updateMainFood} />
      <MainCard
        src={mainFood}
        handlerHeartClick={handlerHeartClick}
        choiceFavorite={choiceFavorite}
      />
      <Favorites favorites={favorites} />
    </div>
  );
}

export default App;
