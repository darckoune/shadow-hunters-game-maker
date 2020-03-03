const imagesFolder = 'public/cards/images';
const cardsFile = 'public/cards/cards.json';
const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, imagesFolder), (err, files) => {
    const cards = files.map(file => {
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
        return {
            name: name.split('-').map(word => capitalizeFirstLetter(word)).join(' '),
            team,
            image: file
        }
    })
    fs.writeFileSync(path.join(__dirname, cardsFile), JSON.stringify(cards, null, 4));
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}