const q = document.getElementById('q');
const pressedRoman = document.getElementById('pressedRoman');
const correctRoman = document.getElementById('correctRoman');

const regex1 = /[ゃゅょ]/;
const selectedWord = [];
const selectedYomi = [];
let separator1;
let separator2;
let separator3;
let all;
let correct = 0;
let wrong = 0;
let romanBuffer = '';
let romanBuffer2 = '';
let word = '';
let yomi = '';
let bufferCorrect1 = '';
let bufferCorrect2 = '';
let bufferCorrect3 = '';
let buffer1 = '';
let buffer2 = '';
let buffer3 = '';
let start = false;
let selected = false;
let first = true;
let second = true;
let third = true;

document.addEventListener('keydown', e => {
    if(start) {
        romanBuffer += e.key;
        judge();
    }
    if(e.key === ' ' && !start) {
        start = true;
        pressedRoman.textContent = '';
        setQ();
    }
});

const setQ = () => {
    const random = Math.floor(Math.random() * Object.keys(words).length);

    if(!selected) {
        for(const buffer in words) {
            selectedWord.push(buffer);
            selectedYomi.push(words[buffer]);
        }
        selected = true;
    }
    word = selectedWord[random];
    yomi = selectedYomi[random];

    q.textContent = word;

    getCorrect();
};

const getCorrect = () => {
    all = yomi.split('');
    for(let c = 0; c < all.length; c++) {
        if(regex1.test(all[c])) {
            const buffer = all[c - 1] + all[c];
            all.splice(c - 1, c + 1, buffer);
        }
    }
    for(let c = 0; c < all.length; c++) {
        if(all[c] === 'っ') {
            buffer1 += romans[all[c + 1]][0][0] + romans[all[c + 1]][0] + '-';
            buffer2 += romans[all[c + 1]][1][0] + romans[all[c + 1]][1] + '-';
            buffer3 += romans[all[c + 1]][2][0] + romans[all[c + 1]][2] + '-';
            c++;
        } else if(all[c] === 'ん') {
            buffer1 += 'n' + romans[all[c + 1]][0] + '-';
            buffer2 += 'n' + romans[all[c + 1]][1] + '-';
            buffer3 += 'n' + romans[all[c + 1]][2] + '-';
            c++
        } else {
            buffer1 += romans[all[c]][0] + '-';
            buffer2 += romans[all[c]][1] + '-';
            buffer3 += romans[all[c]][2] + '-';
        };
    }
    separator1 = buffer1.split('-');
    separator2 = buffer2.split('-');
    separator3 = buffer3.split('-');
};

const judge = () => {
    if(romanBuffer === separator1[0][0] && first) {
        separator1[0] = separator1[0].slice(1);
        second = false;
        third = false;
        if(separator1[0] === '') {
            separator1.shift();
            separator2.shift();
            separator3.shift();
            second = true;
            third = true;
        }
        correct++;
        pressedRoman.textContent += romanBuffer;
        if(correctRoman.textContent) correctRoman.textContent = separator1.join('');
        romanBuffer = '';
    } else if(romanBuffer === separator2[0][0] && second) {
        separator2[0] = separator2[0].slice(1);
        separator3[0] = separator3[0].slice(1);
        first = false;
        if(separator2[0] === '') {
            separator1.shift();
            separator2.shift();
            separator3.shift();
            first  = true;
        }
        correct++;
        pressedRoman.textContent += romanBuffer;
        if(correctRoman.textContent) correctRoman.textContent = separator2.join('');
        romanBuffer = '';
    } else if(romanBuffer === separator3[0][0] && third) {
        separator3[0] = separator3[0].slice(1);
        first = false;
        second = false;
        if(separator3[0] === '') {
            separator1.shift();
            separator2.shift();
            separator3.shift();
            first  = true;
            second = true;
        }
        correct++;
        pressedRoman.textContent += romanBuffer;
        if(correctRoman.textContent) correctRoman.textContent = separator3.join('');
        romanBuffer = '';
    } else {
        wrong++;
        if(first) {
            correctRoman.textContent = separator1.join('');
        } else if(second) {
            correctRoman.textContent = separator2.join('');
        } else correctRoman.textContent = separator3.join('');
        romanBuffer = '';
    }
    if(separator1.length === 1) {
        buffer1 = '';
        buffer2 = '';
        buffer3 = '';
        pressedRoman.textContent = '';
        setQ()
    }
};
