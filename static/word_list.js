'use strict';

const Word = props => {
    const word = props.word;
    const [showMenu, setShowMenu] = React.useState(false);

    const handleMenuToggle = (e) => {
        e.preventDefault();
        setShowMenu(!showMenu);
    };

    const handleAddTag = () => {
        // Perform fetch to add tag endpoint
    };

    const handleSearchTag = () => {
        // Redirect to search URL
        window.location.href = `/search?tags=${word.word}`;
    };
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
            <a href="#" onClick={handleMenuToggle} title={word.idf ? word.idf.toFixed(2) : ""}>
                <div className="rel_word_txt">{word.word}</div>
            </a>
            {showMenu && (
                <div className="menu">
                    {/* Not sure how to capture "Tags of interest" */}
                    {/* You have to 1. find the papers first, then 2. tag those. */}
                    {/* <button onClick={handleAddTag}>Add to my tags of interest</button> */}
                    <button onClick={handleSearchTag}>Search for papers with this tag</button>
                </div>
            )}
        </div>
    )
}

const WordList = props => {
    const lst = props.words;
    const words_desc = props.words_desc;
    const sortedList = lst.sort((a, b) => b.weight - a.weight);
    const wlst = sortedList.map((jword, ix) => <Word key={ix} word={jword} />);
    return (
        <div style={{ maxWidth: 500 }}>
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
