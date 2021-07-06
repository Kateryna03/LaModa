"use strict";

const refHeaderCityButton = document.querySelector('.header__city-button');
//сохраняем наш город в локал сторедж
refHeaderCityButton.textContent = localStorage.getItem('lomoda-location') || "Ваш город?";

refHeaderCityButton.addEventListener('click', () => {
    const city = prompt('Укажите Ваш город');
    refHeaderCityButton.textContent = city;
    localStorage.setItem('lomoda-location', city);
});
//блокировка скролла
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
    document.body.style.cssText = '';
    window.scroll({
        top: document.body.dbScrollY,
    });
};



//реализация модального окна открытие - закрытие
const refSubheaderCart = document.querySelector('.subheader__cart');
const refCartOverlay = document.querySelector('.cart-overlay');

const cartModelOpen = () => {
    refCartOverlay.classList.add('cart-overlay-open');
    disableScroll();
};

const cartModalClose = () => {
    refCartOverlay.classList.remove('cart-overlay-open');
    enableScroll();
};

refSubheaderCart.addEventListener('click', cartModelOpen);

refCartOverlay.addEventListener('click', (event) => {
    const target = event.target;

    if (target.matches('.cart__btn-close')|| target.matches('.cart-overlay')) {
        cartModalClose();
    }
});