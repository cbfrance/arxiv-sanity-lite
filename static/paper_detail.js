'use strict';

const PaperLite = props => {
    const p = props.paper;
    const thumb_img = p.thumb_url === '' ? null : <div data-cy="img_thumb" class='rel_img'><img src={p.thumb_url} /></div>;

    return (
        <div class='rel_paper'>
            <div className='rel_title'><a href={'http://arxiv.org/abs/' + p.id}><h4>{p.title}</h4></a></div>
            <div className='rel_authors'>{p.authors}</div>
            <div className="rel_time">{p.time}</div>
            <div className='rel_tags'>{p.tags}</div>
            <div className='rel_abs'><p>{p.summary}</p></div>
            {thumb_img}
        </div>
    )
}

ReactDOM.render(<PaperLite paper={paper} />, document.getElementById('wrap'))

