'use strict';

const PaperDetail = props => {
    const p = props.paper;
    const thumb_img = p.thumb_url === '' ? null : <div data-cy="img_thumb" className='rel_img'><img src={p.thumb_url} /></div>;

    return (
        <div className='rel_paper'>
            <div className='rel_title'>
                <a href={'http://arxiv.org/abs/' + p.id}>
                    <h1>{p.title}</h1>
                </a>
            </div>
            <h2 className='rel_authors'>{p.authors}</h2>
            <h3 className="rel_time">{p.time}</h3>
            <h3 className='rel_tags'>{p.tags}</h3>
            <p className='rel_abs'>{p.summary}</p>
            {thumb_img}
        </div >
    )
}

ReactDOM.render(<PaperDetail paper={paper} />, document.getElementById('wrap'))

