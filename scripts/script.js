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
const refCartListGoods = document.querySelector(".cart__list-goods");
const refCartTotalCost = document.querySelector(".cart__total-cost");
//1-сохраняем наш город в локал сторедж

const updateLocation = () => {
  refHeaderCityButton.textContent =
    localStorage.getItem("lomoda-location") || "Ваш город?";
};

refHeaderCityButton.addEventListener("click", () => {
  const city = prompt("Укажите Ваш город").trim();
  if (city !== null) {
    localStorage.setItem("lomoda-location", city);
  }
  updateLocation();
});

updateLocation();

//4- создаю 2 функции получения и отправки данных из локал сторедж
const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("cart-lomoda")) || "[]"; //?- после джейсон проверяет если  в данных ничего нет - то вернется налл;
const setLocalStorage = (data) =>
  localStorage.setItem("cart-lomoda", JSON.stringify(data));

//4- рендерим корзину товаров
const renderCart = () => {
  refCartListGoods.textContent = "";

  const cartItems = getLocalStorage();
  let totalPrice = 0;
  cartItems.forEach((item, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${item.brand} ${item.name}</td>
        ${item.color ? `<td>${item.color}</td>` : "<td>-</td>"}
        ${item.size ? `<td>${item.size}</td>` : "<td>-</td>"}
        <td>${item.cost} &#8381;</td>
        <td><button class="btn-delete" data-id="${
          item.id
        }">&times;</button></td>
    `;
    totalPrice += item.cost;
    refCartListGoods.append(tr);
  });
  refCartTotalCost.textContent = totalPrice;
};
//1-блокировка скролла
const disableScroll = () => {
  if (document.disableScroll) {
    return;
  }

  const widthScroll = window.innerWidth - document.body.offsetWidth;
  document.disableScroll = true;

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
  renderCart();
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

  const renderCardGood = ([{ id, photo, brand, name, cost, color, sizes }]) => {
    //подставляет значения по каждому товару

    const data = { id, brand, name, cost }; // создаю объект с данными из корзины
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

    refCardGoodBuy.addEventListener("click", () => {
      if (color) {
        data.color = refCardGoodColor.textContent;
      }

      if (sizes) {
        data.size = refCardGoodSizes.textContent;
      }

      const cardData = getLocalStorage();
      cardData.push(data);
      setLocalStorage(cardData);
    });
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
