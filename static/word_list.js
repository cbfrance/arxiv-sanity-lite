'use strict';

const Word = props => {
    const p = props.word;
    // word, weight, idf
    const containerStyle = {
        position: 'relative'
    };
    const barStyle = {
        width: `${p.weight * 100}%`,
        backgroundColor: 'rgba(0,0,0,0.1)',
        height: '100%',
        position: 'absolute'
    };
    return (
        <div style={containerStyle} class='rel_word'>
            <div style={barStyle}></div>
            {/* @TODO: on the paper list view, p.idf is undefined. @cbfrance 2023-Sept-9 */}
            {/* <div class='rel_word_idf'>{p.idf.toFixed(2)}</div> */}
            <div class="rel_word_txt">{p.word}</div>
        </div>
    )
}

const WordList = props => {
    const lst = props.words;
    const words_desc = props.words_desc;
    const sortedList = lst.sort((a, b) => b.weight - a.weight);
    const wlst = sortedList.map((jword, ix) => <Word key={ix} word={jword} />);
    return (
        <div>
            <div>{words_desc}</div>
            <div id="wordList" class="rel_words">
                {wlst}
            </div>
        </div>
    )
}

var elt = document.getElementById('wordwrap');
if (elt) {
    ReactDOM.render(<WordList words={words} words_desc={words_desc} />, elt);
}
