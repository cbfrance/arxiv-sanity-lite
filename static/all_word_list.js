const Term = props => {
    const { word, weight } = props;
    const turl = "/?rank=tags&tags=" + word;

    const handleClick = (e) => {
        // e.preventDefault();
    };

    return (
        <div className='rel_Term'>
            <a href={turl} alt={weight} onClick={handleClick}>
                {word}
            </a>
        </div>
    )
}

// Compare to wordList which has slightly different purpose: 
// WordList lists the tags for your view or a paper
// AllTermList is for the entire paper corpus
// This is a list of words which are indexed, can be added to search
// This view makes it easy to search them
const AllTermList = props => {
    const { terms } = props;
    const allTerms = terms.map((termObj, ix) => <Term key={ix} word={termObj.term} weight={termObj.weight} />);

    return (
        <div>
            <p>top terms found in this feed:</p>
            <div id="all-top-terms" style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                {allTerms}
            </div>
        </div>
    )
}


var elt = document.getElementById('all-top-terms');
if (elt) {
    ReactDOM.render(<AllTermList terms={all_top_terms} />, elt);
}
