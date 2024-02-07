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
    if (window.isLoggedIn) {
        utag_controls = (
            <div className='rel_utags'>
                <a className="rel_utag rel_utag_add" onClick={adder}>add a tag</a>
                {utags}
            </div>
        )
    }

    // Create a dotted gauge based on the normalized weight
    const filledDots = "●".repeat(Math.round(p.normalized_weight.toFixed(2) / 25));
    const emptyDots = "○".repeat(4 - filledDots.length);
    const gauge = filledDots + emptyDots;

    // Function to translate raw tags to full category names
    const category_translator = (tag) => {
        const categories = {
            'cs.AI': 'Artificial Intelligence',
            'cs.CL': 'Computation and Language',
            'cs.CC': 'Computational Complexity',
            'cs.CE': 'Computational Engineering, Finance, and Science',
            'cs.CG': 'Computational Geometry',
            'cs.GT': 'Computer Science and Game Theory',
            'cs.CV': 'Computer Vision and Pattern Recognition',
            'cs.CY': 'Computers and Society',
            'cs.CR': 'Cryptography and Security',
            'cs.DS': 'Data Structures and Algorithms',
            'cs.DB': 'Databases',
            'cs.DL': 'Digital Libraries',
            'cs.DM': 'Discrete Mathematics',
            'cs.DC': 'Distributed, Parallel, and Cluster Computing',
            'cs.GL': 'General Literature',
            'cs.GR': 'Graphics',
            'cs.AR': 'Hardware Architecture',
            'cs.HC': 'Human-Computer Interaction',
            'cs.IR': 'Information Retrieval',
            'cs.IT': 'Information Theory',
            'cs.LG': 'Machine Learning',
            'cs.LO': 'Logic in Computer Science',
            'cs.MS': 'Mathematical Software',
            'cs.MA': 'Multiagent Systems',
            'cs.MM': 'Multimedia',
            'cs.NI': 'Networking and Internet Architecture',
            'cs.NE': 'Neural and Evolutionary Computing',
            'cs.NA': 'Numerical Analysis',
            'cs.OS': 'Operating Systems',
            'cs.OH': 'Other Computer Science',
            'cs.PF': 'Performance',
            'cs.PL': 'Programming Languages',
            'cs.RO': 'Robotics',
            'cs.SI': 'Social and Information Networks',
            'cs.SE': 'Software Engineering',
            'cs.SD': 'Sound',
            'cs.SC': 'Symbolic Computation',
            'cs.SY': 'Systems and Control',
        };
        return categories[tag] || tag;
    };

    // Translate and link the tags
    const arxivCatTags = p.tags && typeof p.tags === "string" && p.tags.split(',').map((catTag, index) => {
        const full_name = category_translator(catTag.trim());
        const catTag_url = `http://arxiv.org/archive/${catTag.trim()}`;
        return <div className="row" style={{ gap: "0.3rem ", alignItems: "center" }} key={index}>
            <a id="tagLink" key={`tagLinkKey_${index}`} href={catTag_url} style={{ fontSize: "8px", textDecoration: "none", display: "inline-block" }}>
                <span style={{ backgroundColor: "blue", color: "white", padding: "2px 4px" }}>arxiv</span>
                <span style={{ backgroundColor: "#ccc", color: "blue", padding: "2px 4px" }}>{catTag}</span>
            </a>
            {full_name}
        </div>;
    });

    const VisualizationMatrix = window.VisualizationMatrix;

    return (
        <div className='rel_paper'>
            <h4 className='rel_title'><a href={'http://arxiv.org/abs/' + p.id}>{p.title}</a></h4>
            <div className="row">
                <div className="col">
                    <div className="rel_score">{p.normalized_weight.toFixed(2)}</div>
                    <div className='rel_gauge'>{gauge} relevance in this view</div>
                    <div className='rel_authors'>{p.authors}</div>
                    <div className="rel_time">{p.time}</div>
                    <div className='rel_tags'>{arxivCatTags}</div>
                    {utag_controls}
                    {thumb_img}
                    <div className='rel_abs'>{p.summary}</div>
                    <div className="row">
                        <div className='rel_more'><a href={similar_url}>similar</a></div>
                        <div className='rel_inspect'><a href={inspect_url}>inspect</a></div>
                        <div className="row">
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
                        </div>
                    </div>
                </div>
                <div className="col">
                    <VisualizationMatrix terms={["One", "Two"]} />
                </div>
            </div>
        </div>

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
            <a href={turl} title={t.n} >
                {t.name}
            </a>
        </div>
    )
}

const TagList = props => {
    const lst = props.tags;
    const tlst = lst.map((jtag, ix) => <Tag key={ix} tag={jtag} />);
    const deleter = () => fetch("/del/" + prompt("delete tag name:"))
        .then(response => console.log(response.text()));
    // show the #wordwrap element if the user clicks inspect
    const toggle_inspect = () => {
        const wordwrap = document.getElementById("wordwrap");
        wordwrap.style.display = wordwrap.style.display === "none" ? "block" : "none";
    };

    return (
        <div>
            <p>Your tags</p>
            <div id="tagList" className="rel_utags" style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                {tlst}
            </div>
            <div className="row">
                {window.words.length > 0 ? <button id="inspect_svm" onClick={toggle_inspect}>toggle svm</button> : null}
                {window.words.map((word, index) => <div key={index}>{word}</div>)}
                <button className="rel_tag" onClick={deleter}>delete tag</button>
            </div>
        </div>
    )
}

// render papers into #wrap
ReactDOM.render(<PaperList papers={papers} />, document.getElementById('wrap'));

// render tags into #tagwrap, if it exists
let tagwrap_elt = document.getElementById('tagwrap');
if (tagwrap_elt) {
    ReactDOM.render(<TagList tags={tags} />, tagwrap_elt);
}
