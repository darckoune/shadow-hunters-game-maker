const imagesFolder = 'public/cards/images';
const cardsFile = 'public/cards/cards.json';
const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(path.join(__dirname, imagesFolder)).filter(file => file !== 'default.webp');
const images = files.filter(file => file.endsWith('.webp'));

const cards = images.map(file => {
    const name = file.split('.')[0];
    let team;
    switch (name.substr(0,1)) {
        case 'a':
        case 'b':
        case 'c':
        case 'd':
            team = 'neutral';
            break;
        case 'e':
        case 'f':
        case 'g':
            team = 'hunter';
            break;
        case 'm':
        case 'v':
        case 'l':
            team = 'shadow';
            break;
    }
    const fallbacks = files.filter(file => !file.endsWith('.webp') && file.startsWith(name));
    return {
        name: name.split('-').map(word => capitalizeFirstLetter(word)).join(' '),
        team,
        image: file,
        imageFallbacks: fallbacks
    }
})
fs.writeFileSync(path.join(__dirname, cardsFile), JSON.stringify(cards, null, 4));

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}