const main = document.querySelector('main');
const AI_coments = document.getElementById('AI_coments');
const q = document.getElementById('q');
const pressedRoman = document.getElementById('pressedRoman');
const correctRoman = document.getElementById('correctRoman');
const show_correct = document.getElementById('show_correct');
const show_wrong = document.getElementById('show_wrong');
const result_correct = document.getElementById('result_correct');
const result_wrong = document.getElementById('result_wrong');
const frame1 = document.getElementById('frame1');
const frame2 = document.getElementById('frame2');

const regex1 = /[ゃゅょ]/;
const selectedWord = [];
const selectedYomi = [];
const missedKeys = [];
const missedList = [];
const missList = {};
const sortedMissList = {};
const AI_name = 'AI>>';
const log_type1 = [
    `${AI_name}${Object.keys(sortedMissList)[0]}あと一文字やな`,
];
let separator1, separator2, separator3, all;
let correct = 0;
let wrong = 0;
let LIMIT_INDEX = 15;
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
let end = false;

document.addEventListener('keydown', e => {
    if(start && e.key !== 'Shift' && e.key !== 'Escape') {
        e.preventDefault();
        romanBuffer += e.key;
        judge();
    }
    if(e.key === ' ' && !start && !end) {
        e.preventDefault();
        document.getElementById('caret').hidden = false;
        correctRoman.textContent = pressedRoman.textContent = '';
        correctRoman.classList.remove('animation2');
        timeUntilStart();
    }
    if(e.key === 'Escape' && start && !end) reset();
    if(e.key === 'r' && end) reset();
});

const timeUntilStart = () => {
    end = true;
    let time = 3;
    q.textContent = String(time);
    const count = setInterval(() => {
        time--;
        q.textContent = String(time);
        if(time === 1) {
            audios[2].currentTime = 0;
            audios[2].play();
        }
        if(time <= 0) {
            clearInterval(count);
            start = true;
            end = false;
            setQ();
        }
    }, 1000);
};

const setQ = () => {
    LIMIT_INDEX--;
    const random = Math.floor(Math.random() * Object.keys(normal_words).length);

    if(!selected) {
        for(const buffer in normal_words) {
            selectedWord.push(buffer);
            selectedYomi.push(normal_words[buffer]);
        }
        selected = true;
    }
    word = selectedWord[random];
    yomi = selectedYomi[random];
    q.textContent = word;
    getCorrect();
};

const reset = () => {
    end = false;
    start = false;
    correct = wrong = 0;
    separator1.length = separator2.length = separator3.length = 0;
    pressedRoman.textContent = buffer1 = buffer2 = buffer3 = '';
    frame2.hidden = document.getElementById('caret').hidden = true;
    correctRoman.classList.add('animation2');
    frame2.classList.remove('animation1');
    correctRoman.classList.remove('missUnder');
    show_correct.textContent = show_wrong.textContent = 0;
    q.textContent = 'ここに問題が表示されます';
    correctRoman.textContent = 'スペースキーを押してスタート';
};

const getCorrect = () => {
    all = yomi.split('');
    for(let c = 0; c < all.length; c++) {
        if(regex1.test(all[c + 1])) {
            const buffer = all[c] + all[c + 1];
            all.splice(c, 2, buffer);
        }
    }
    for(let c = 0; c < all.length; c++) {
        if(all[c] === 'っ') {
            buffer1 += romans[all[c + 1]][0][0] + romans[all[c + 1]][0] + '@';
            buffer2 += romans[all[c + 1]][1][0] + romans[all[c + 1]][1] + '@';
            buffer3 += romans[all[c + 1]][2][0] + romans[all[c + 1]][2] + '@';
            c++;
        } else if(all[c] === 'ん' && all[c + 1]) {
            buffer1 += 'n' + romans[all[c + 1]][0] + '@';
            buffer2 += 'n' + romans[all[c + 1]][1] + '@';
            buffer3 += 'n' + romans[all[c + 1]][2] + '@';
            c++
        } else {
            buffer1 += romans[all[c]][0] + '@';
            buffer2 += romans[all[c]][1] + '@';
            buffer3 += romans[all[c]][2] + '@';
        };
    }
    separator1 = buffer1.split('@');
    separator2 = buffer2.split('@');
    separator3 = buffer3.split('@');
};

const getWrong = () => {
    if(missedKeys[0]) {
        let keys;
        missedKeys.forEach(count=> {
            if(!missList[count]) missList[count] = 0;
            missList[count]++;
        });
        keys = Object.keys(missList);
        keys.sort((a, b) => missList[b] - missList[a]);
        keys.forEach(key => sortedMissList[key] = missList[key]);
        missedList.push(Object.keys(sortedMissList)[0]);
    }
    createAIComent();
    missedKeys.length = 0;
    for(const buffer in missList) [missList, sortedMissList].forEach(obj => delete obj[buffer]);
};

const createAIComent = () => {
    const li = document.createElement('li');
    if(AI_coments.children.length > 0) AI_coments.removeChild(AI_coments.firstChild);
    if(missedKeys[0]) {
        let coment = '';
        if(wrong >= 1 && wrong < 2) coment = log_type1[0];
        li.innerHTML = coment;
        AI_coments.appendChild(li);
    } else {
        let coment = '';
        li.innerHTML = coments[random];
        AI_coments.appendChild(li);
    }
};

const judge = () => {
    if(romanBuffer === separator1[0][0] && first) {
        if(separator1[0][0] === separator2[0][0] && separator2[0][0] === separator3[0][0]) {
            separator1[0] = separator1[0].slice(1);
            separator2[0] = separator2[0].slice(1);
            separator3[0] = separator3[0].slice(1);
        } else if(separator1[0][0] === separator2[0][0]) {
            separator1[0] = separator1[0].slice(1);
            separator2[0] = separator2[0].slice(1);
            third = false;
        } else if(separator1[0][0] === separator3[0][0]) {
            separator1[0] = separator1[0].slice(1);
            separator3[0] = separator3[0].slice(1);
            second = false;
        } else {
            separator1[0] = separator1[0].slice(1);
            second = false;
            third = false;
        }
        if(separator1[0] === '') {
            [separator1, separator2, separator3].forEach(arr => arr.shift());
            second = true;
            third = true;
        }
        correct++;
        show_correct.textContent = String(correct);
        correctRoman.classList.remove('missUnder');
        pressedRoman.textContent += romanBuffer;
        if(correctRoman.textContent) correctRoman.textContent = separator1.join('');
        romanBuffer = '';
    } else if(romanBuffer === separator2[0][0] && second) {
        separator2[0] = separator2[0].slice(1);
        separator3[0] = separator3[0].slice(1);
        first = false;
        if(separator2[0] === '') {
            [separator1, separator2, separator3].forEach(arr => arr.shift());
            first  = true;
        }
        correct++;
        show_correct.textContent = String(correct);
        correctRoman.classList.remove('missUnder');
        pressedRoman.textContent += romanBuffer;
        if(correctRoman.textContent) correctRoman.textContent = separator2.join('');
        romanBuffer = '';
    } else if(romanBuffer === separator3[0][0] && third) {
        separator3[0] = separator3[0].slice(1);
        first = false;
        second = false;
        if(separator3[0] === '') {
            [separator1, separator2, separator3].forEach(arr => arr.shift());
            first  = true;
            second = true;
        }
        correct++;
        show_correct.textContent = String(correct);
        correctRoman.classList.remove('missUnder');
        pressedRoman.textContent += romanBuffer;
        if(correctRoman.textContent) correctRoman.textContent = separator3.join('');
        romanBuffer = '';
    } else {
        audios[0].currentTime = 0;
        audios[0].volume = 0.2;
        audios[0].play();
        document.body.classList.remove('animation4');
        void document.body.offsetWidth;
        document.body.classList.add('animation4');
        wrong++;
        missedKeys.push(separator1[0][0]);
        show_wrong.textContent = String(wrong);
        correctRoman.classList.add('missUnder');
        if(first) {
            correctRoman.textContent = separator1.join('');
        } else if(second) {
            correctRoman.textContent = separator2.join('');
        } else correctRoman.textContent = separator3.join('');
        romanBuffer = '';
    }
    if(separator1.length === 1) {
        pressedRoman.textContent = buffer1 = buffer2 = buffer3 = '';
        if(LIMIT_INDEX === 0) {
            audios[0].play();
            getWrong();
            frame2.hidden = false;
            frame2.classList.add('animation1');
            result_correct.textContent = String(correct);
            result_wrong.textContent = String(wrong);
            q.textContent = '';
            correct = wrong = 0;
            LIMIT_INDEX = 2;
            start = false;
            end = true;
            return;
        }
        setQ()
    }
};
