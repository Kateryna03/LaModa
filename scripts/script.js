"use strict";
let hash = location.hash.slice(1);
const refHeaderCityButton = document.querySelector(".header__city-button");
const refSubheaderCart = document.querySelector(".subheader__cart");
const refCartOverlay = document.querySelector(".cart-overlay");
const refGoodList = document.querySelector(".goods__list");
const refGoodTitle = document.querySelector(".goods__title");
console.log(refGoodTitle);
const refNavigationlist = document.querySelector(".navigation__list");
const refNavigationlink = document.querySelectorAll(".navigation__link");
console.log(refNavigationlink);

//1-сохраняем наш город в локал сторедж
refHeaderCityButton.textContent =
  localStorage.getItem("lomoda-location") || "Ваш город?";

refHeaderCityButton.addEventListener("click", () => {
  const city = prompt("Укажите Ваш город");
  refHeaderCityButton.textContent = city;
  localStorage.setItem("lomoda-location", city);
});

//1-блокировка скролла
const disableScroll = () => {
  const widthScroll = window.innerWidth - document.body.offsetWidth;

  document.body.dbScrollY = window.scrollY;

  document.body.style.cssText = `
    position:fixed;
    top:${-window.scrollY}px;
    left:0;
    width:100%;
    height:100vh;
    overflow: hidden;
    padding-right:${widthScroll}px;
    `;
};

const enableScroll = () => {
  document.body.style.cssText = "";
  window.scroll({
    top: document.body.dbScrollY,
  });
};

//1-реализация модального окна открытие - закрытие
const cartModelOpen = () => {
  refCartOverlay.classList.add("cart-overlay-open");
  disableScroll();
};

const cartModalClose = () => {
  refCartOverlay.classList.remove("cart-overlay-open");
  enableScroll();
};

//2-запрос базы данных
const getData = async () => {
  const data = await fetch("db.json");

  if (data.ok) {
    return data.json();
  } else {
    throw new Error(
      `Данные не были получены, ошибка ${data.status} ${data.statusText}`
    );
  }
};
// меняю название заголовка страниц товаров

// const changeTitleName = (e) => {
//   const categoryName = e.target.textContent;
//   //console.log(categoryName);
//   refGoodTitle.textContent = categoryName;
// };
const changeTitleName = () => {
  refNavigationlink.forEach((item) => {
    if (item.hash.slice(1) === hash) {
      refGoodTitle.textContent = item.textContent;
    }
  });
};

const getGoods = (callback, property, value) => {
  //добавляем свойства для карточки товара и везде где вызываем эту функцию добавляем катгорию;
  getData()
    .then((data) => {
      if (value) {
        callback(data.filter((item) => item[property] === value));
      } else {
        callback(data);
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

// getGoods((data) => {
//   console.warn(data);
// });

//1-добавляем слушателей событий

refSubheaderCart.addEventListener("click", cartModelOpen);

refCartOverlay.addEventListener("click", (event) => {
  const target = event.target;

  if (target.matches(".cart__btn-close") || target.matches(".cart-overlay")) {
    cartModalClose();
  }
});

try {
  console.log(hash);
  if (!refGoodList) {
    throw "This is not a goods page!";
  }

  const createCard = ({ id, preview, brand, cost, sizes, name }) => {
    const li = document.createElement("li");
    li.classList.add("goods__item");
    li.innerHTML = `
                       <article class="good">
                            <a class="good__link-img" href="card-good.html#${id}">
                                <img class="good__img" src="goods-image/${preview}" alt="">
                            </a>
                            <div class="good__description">
                                <p class="good__price">${cost} &#8381;</p>
                                <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                                ${
                                  sizes
                                    ? `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(
                                        " "
                                      )}</span></p>`
                                    : " "
                                }
                                <a class="good__link" href="card-good.html#${id}">Подробнее</a>
                            </div>
                        </article>
    `;
    return li;
  };

  const renderGoodsList = (data) => {
    refGoodList.textContent = " ";

    data.forEach((item) => {
      const card = createCard(item);
      refGoodList.append(card);
    });
  };

  //refNavigationlist.addEventListener("click", changeTitleName);

  window.addEventListener("hashchange", () => {
    hash = location.hash.slice(1);

    getGoods(renderGoodsList, "category", hash);
    // changeTitleName();
  });
  changeTitleName();
  getGoods(renderGoodsList, "category", hash);
} catch (error) {
  console.warn(error);
}

//карточка товара

try {
  const refCardGood = document.querySelector(".card-good");
  if (!refCardGood) {
    throw "This is not a card-good page!"; //проаеряем что находимся на странице html карточки товара
  }
  const refСardGoodSelectWrapper = document.querySelectorAll(
    ".card-good__select__wrapper"
  );
  const refCardGoodImage = document.querySelector(".card-good__image");
  const refCardGoodBrand = document.querySelector(".card-good__brand");
  const refCardGoodTitle = document.querySelector(".card-good__title");
  const refCardGoodPrice = document.querySelector(".card-good__price");
  const refCardGoodColor = document.querySelector(".card-good__color");
  const refCardGoodColorList = document.querySelector(".card-good__color-list");
  const refCardGoodSizes = document.querySelector(".card-good__sizes");
  const refCardGoodSizesList = document.querySelector(".card-good__sizes-list");
  const refCardGoodBuy = document.querySelector(".card-good__buy");

  const generateList = (data) =>
    data.reduce(
      (html, item, i) =>
        html + `<li class="card-good__select-item" data-id="${i}">${item}</li>`,
      " "
    );

  const renderCardGood = ([{ photo, brand, name, cost, color, sizes }]) => {
    //подставляет значения по каждому товару
    console.log(brand);
    refCardGoodImage.src = `goods-image/${photo}`;
    refCardGoodImage.alt = `${brand} ${name}`;
    refCardGoodBrand.textContent = brand;
    refCardGoodTitle.textContent = name;
    refCardGoodPrice.textContent = `${cost} ₽`;
    if (color) {
      refCardGoodColor.textContent = color[0];
      refCardGoodColor.dataset.id = 0;
      refCardGoodColorList.innerHTML = generateList(color);
    } else {
      refCardGoodColor.style.display = "none"; //если размер и цвет выбрать нельзя - селекторы прячем
    }

    if (sizes) {
      refCardGoodSizes.textContent = sizes[0];
      refCardGoodSizes.dataset.id = 0;
      refCardGoodSizesList.innerHTML = generateList(sizes);
    } else {
      refCardGoodSizes.style.display = "none";
    }
  };
  //вешаем слушателя событий на контейнер
  refСardGoodSelectWrapper.forEach((item) => {
    item.addEventListener("click", (e) => {
      const target = e.target;
      //если кликаем на кнопку
      if (target.closest(".card-good__select")) {
        target.classList.toggle("card-good__select__open");
      }
      //если кликаем на ли внутри списка
      if (target.closest(".card-good__select-item")) {
        const refCardGoodSelect = item.querySelector(".card-good__select");
        refCardGoodSelect.textContent = target.textContent;
        refCardGoodSelect.dataset.id = target.dataset.id;
        refCardGoodSelect.classList.remove("card-good__select__open");
      }
    });
  });
  getGoods(renderCardGood, "id", hash);
} catch (error) {
  console.warn(error);
}
