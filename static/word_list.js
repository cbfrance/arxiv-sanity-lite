'use strict';

const Word = props => {
    const word = props.word;
    // word, weight, idf
    const containerStyle = {
        position: 'relative'
    };
    const barStyle = {
        width: `${word.weight * 100}%`,
        backgroundColor: 'rgba(0,0,0,0.1)',
        height: '100%',
        position: 'absolute'
    };
    return (
        <div style={containerStyle} className='rel_word'>
            <div style={barStyle}></div>
            {/* @TODO: on the paper list view, word.idf is undefined. @cbfrance 2023-Sept-9 */}
            <div className='rel_word_idf'>{word.idf ? word.idf.toFixed(2) : ""}</div>
            <div className="rel_word_txt">{word.word}</div>
        </div>
    )
}

const WordList = props => {
    const lst = props.words;
    const words_desc = props.words_desc;
    const sortedList = lst.sort((a, b) => b.weight - a.weight);
    const wlst = sortedList.map((jword, ix) => <Word key={ix} word={jword} />);
    return (
        <div style={{maxWidth: 500}}>
            <div>{words_desc}</div>
            <div id="wordList" className="rel_words">
                {wlst}
            </div>
        </div>
    )
}

var elt = document.getElementById('wordwrap');
if (elt) {
    ReactDOM.render(<WordList words={words} words_desc={words_desc} />, elt);
}
