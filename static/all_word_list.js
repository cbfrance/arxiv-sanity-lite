const Rect = props => {
    const { word, weight } = props;
    const turl = "/?rank=tags&tags=" + word;

    const handleClick = (e) => {
        // e.preventDefault();
    };

    return (
        <div className='rel_rect'>
            <a href={turl} alt={weight} onClick={handleClick}>
                {word}
            </a>
        </div>
    )
}

// Compare to wordList which has slightly different purpose: 
// WordList lists the tags for your view or a paper
// AllWordList is for the entire paper corpus
// This is a list of words which are indexed, can be added to search
// This view makes it easy to search them
const AllWordList = props => {
    const { all_top_words } = props;
    const allWordList = all_top_words.map((wordObj, ix) => <Rect key={ix} word={wordObj.word} weight={wordObj.weight} />);

    return (
        <div>
            <p>Top Words</p>
            <div id="allWordList" style={{display: "flex", gap: "0.3rem", flexWrap: "wrap"}}>
                {allWordList}
            </div>
        </div>
    )
}


var elt = document.getElementById('all-word-list');
if (elt) {
    ReactDOM.render(<AllWordList all_top_words={all_top_words} />, elt);
}
