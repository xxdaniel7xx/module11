// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const minWeightInput = document.querySelector('.minweight__input'); // поле минимального веса
const maxWeightInput = document.querySelector('.maxweight__input'); // поле максимального веса

let colorArr = ['красный', 'оранжевый', 'желтый', 'зеленый', 'коричневый', 'фиолетовый']; //формирую массив возможных цветов

let classArr = ['fruit_red', 'fruit_orange', 'fruit_yellow', 'fruit_green', 'fruit_brown', 'fruit_violet'];

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/


// отрисовка карточек
const display = () => {

  while (fruitsList.firstChild) {
    fruitsList.removeChild(fruitsList.firstChild);}

  for (let i = 0; i < fruits.length; i++) {
    let li = document.createElement('li');
    li.className = "fruit__item";


    colorArr.forEach(function (element, index) {
      if (element == fruits[i].color){
        li.classList.add(classArr[index]);
      }
    })

    let div = document.createElement('div');
    div.className = "fruit__info";

    fruitsList.appendChild(li).appendChild(div);

    div.appendChild(document.createElement('div')).innerHTML = (`index: ${i}`);


    for (let j in fruits[i]){
      if (j == 'kind'){
        div.appendChild(document.createElement('div')).innerHTML = (`kind: ${fruits[i][j]}`);
      } else if (j == 'color') {
        div.appendChild(document.createElement('div')).innerHTML = (`color: ${fruits[i][j]}`);
      } else if (j == 'weight') {
        div.appendChild(document.createElement('div')).innerHTML = (`weight (кг): ${fruits[i][j]}`);
      }
    }

  }
};


// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  while (fruits.length > 0) {

    randomNumber = getRandomInt(0, fruits.length);
    fruitsElem = fruits[randomNumber];
    fruits.splice(randomNumber,1);
    result.push(fruitsElem);

  }

  fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  if (minWeightInput.value != '' || maxWeightInput.value != '') {
    let result = fruits.filter(item => item.weight > minWeightInput.value && item.weight < maxWeightInput.value)
    fruits = result;
  } else {
    alert('Заполните поля!');
  }

};

filterButton.addEventListener('click', () => {
    filterFruits();
    display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки


const comparationColor = (a,b) => {
  let priority1 = colorArr.indexOf(a.color);
  let priority2 = colorArr.indexOf(b.color);
  return priority1 > priority2;

};

const sortAPI = {
  bubbleSort(fruits) {
    let n = fruits.length;
    for (let i = 0; i < n-1; i++) {
      for (let j = 0; j < n-1-i; j++) {
        if (comparationColor(fruits[j], fruits[j+1])) {
          let temp = fruits[j+1];
          fruits[j+1] = fruits[j];
          fruits[j] = temp;
        }
      }
    }
  },

  quickSort(fruits) {

    function swap(items, firstIndex, secondIndex){
      const temp = items[firstIndex];
      items[firstIndex] = items[secondIndex];
      items[secondIndex] = temp;
    }

    function partition(items, left, right) {
      let pivot   = items[Math.floor((right + left) / 2)],
          i       = left,
          j       = right;
      while (i <= j) {
        while (comparationColor(pivot, items[i])) {
          i++;
        }
        while (comparationColor(items[j], pivot)) {
          j--;
        }
        if (i <= j) {
          swap(items, i, j);
          i++;
          j--;
        }
      }
      return i;
    }

    function quickSortFunc(items, left, right) {
      let index;
      if (items.length > 1) {
        index = partition(items, left, right);
        if (left < index - 1) {
          quickSortFunc(items, left, index - 1);
        }
        if (index < right) {
          quickSortFunc(items, index, right);
        }
      }
      return items;
    }
    quickSortFunc(fruits, 0, fruits.length-1)
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;
let indSort = true
sortChangeButton.addEventListener('click', () => {

  if (indSort == true) {
    sortKind = 'quickSort';
    sortKindLabel.textContent = sortKind
    indSort = false
  } else {
    sortKind = 'bubbleSort';
    sortKindLabel.textContent = sortKind
    indSort = true
  }

});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  sortTimeLabel.textContent = sortTime
});

/*** ДОБАВИТЬ ФРУКТ ***/

let inputArr = []
    inputArr.push(kindInput,colorInput,weightInput);

addActionButton.addEventListener('click', () => {
  let ind = true;
  for ( let i of inputArr) {
    if (i.value == '' || i.value == ' ') {
      alert('заполните все поля!');
      ind = false;
      break
    }
  }
  if (ind == true) {
    let newFruit = {
      kind: kindInput.value,
      color: colorInput.value,
      weight: weightInput.value,
    }
    fruits.push(newFruit)
    fruitsJSON = JSON.stringify(fruits);
    display();
    kindInput.value = colorInput.value = weightInput.value = '';
    return newFruit
  }
});
