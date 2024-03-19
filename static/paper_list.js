'use strict';

function noop() {
    alert('This feature doesn\'t exist yet, but thank you for your interest. It has been noted.');
    // log the click
}

const UTag = props => {
    const tag_name = props.tag;
    const turl = "/?rank=tags&tags=" + tag_name;
    return (
        <div className='rel_utag'>
            <a href={turl}>
                {tag_name}
            </a>
        </div>
    )
}

const Paper = props => {
    const p = props.paper;

    const adder = () => fetch("/add/" + p.id + "/" + prompt("tag to add to this paper:"))
        .then(response => console.log(response.text()));
    // const subber = () => fetch("/sub/" + p.id + "/" + prompt("tag to subtract from this paper:"))
    //     .then(response => console.log(response.text()));
    const utags = p.utags.map((utxt, ix) => <UTag key={ix} tag={utxt} />);
    const similar_url = "/?rank=pid&pid=" + p.id;
    const inspect_url = "/inspect?pid=" + p.id;
    const thumb_img = p.thumb_url === '' ? null : <div className='rel_img'><img src={p.thumb_url} /></div>;

    // if the user is logged in then we can show add/sub buttons
    let utag_controls = null;
    if (window.user) {
        utag_controls = (
            <div className='rel_utags'>
                <a className="rel_utag rel_utag_add" onClick={adder}>add a tag</a>
                {utags}
            </div>
        )
    }

    // Create a dotted gauge based on the normalized weight
    const filledDots = "●".repeat(Math.round(p.normalized_weight.toFixed(2) / 10));
    const emptyDots = "○".repeat(10 - filledDots.length);
    const gauge = filledDots + emptyDots;

    return (
        <div className='rel_paper'>
            {/* <div className='rel_paper' style={{opacity: p.normalized_weight.toFixed(2) + '%'}}> */}

            <div className="rel_score">{p.normalized_weight.toFixed(2)}</div>
            {/* <h2 className='rel_title'><a href={'http://arxiv.org/abs/' + p.id}>{p.title}</a></h2> */}
            <h2 className='rel_title'><a href={inspect_url}>{p.title}</a></h2>
            <div className='rel_gauge'>{gauge} relevance in this view</div>
            <div className='rel_authors'>{p.authors}</div>
            <div className="rel_time">{p.time}</div>
            <div className='rel_tags'>{p.tags}</div>
            {utag_controls}
            {thumb_img}
            <div className='rel_abs'>{p.summary}</div>
            <div className="row">
                <div className='rel_more'><a href={similar_url}>similar</a></div>
                {/* <div className='rel_inspect'><a href={inspect_url}>inspect</a></div> */}
                <a href="#" onClick={(e) => {
                    e.preventDefault(); noop();
                }}>
                    save for later
                </a>
                <a href="#" onClick={(e) => {
                    e.preventDefault(); noop();
                }}>
                    add to zotero
                </a>
                {/* <div className='add_to_zotero'><a href={add_to_zotero_url}>add to zotero</a></div> */}
            </div>
        </div >
    )
}

const PaperList = props => {
    const lst = props.papers;
    const plst = lst.map((jpaper, ix) => <Paper key={ix} paper={jpaper} />);
    return (
        <div>
            <div id="paperList" className="rel_papers col">
                {plst}
            </div>
        </div>
    )
}

const Tag = props => {
    const t = props.tag;
    const turl = "/?rank=tags&tags=" + t.name;
    const tag_class = 'rel_utag' + (t.name === 'all' ? ' rel_utag_all' : '');
    return (
        <div className={tag_class}>
            <a href={turl}>
                {t.n} {t.name}
            </a>
        </div>
    )
}

const TagList = props => {
    const lst = props.tags;
    const tlst = lst.map((jtag, ix) => <Tag key={ix} tag={jtag} />);
    const deleter = (tagName) => () => fetch("/del/" + tagName)
        .then(response => response.text())
        .then(text => console.log(text));
    // show the #wordwrap element if the user clicks inspect
    const show_inspect = () => { document.getElementById("wordwrap").style.display = "block"; };
    const inspect_elt = words.length > 0 ? <div id="inspect_svm" onClick={show_inspect}>inspect</div> : null;
    return (
        <div>
            <div className="rel_tag" onClick={() => deleter(t.name)}>-</div>
            <div id="tagList" className="rel_utags">
                {tlst}
            </div>
            {inspect_elt}
        </div>
    )
}

// 1. render papers into #wrap
ReactDOM.render(<PaperList papers={papers} />, document.getElementById('wrap'));

// 2. render tags into #tagwrap, if it exists
let tagwrap_elt = document.getElementById('tagwrap');
if (tagwrap_elt) {
    ReactDOM.render(<TagList tags={tags} />, tagwrap_elt);
}
