import { readable } from 'svelte/store';

export const cardsStore = readable([], set => {
    fetch(window.origin + '/cards/cards.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            set(data);
        })
});