
// Pretty print objects to the UI for debugging
class Debugger extends React.Component {

    handleValue(value, depth = 0) {
        
        const padding = `${depth}rem`;
        if (value === null || value === undefined) {
            return <div style={{ paddingLeft: padding }}>{String(value)}</div>;
        } else if (Array.isArray(value)) {
            return value.map((v, i) =>
            <div key={i} style={{ paddingLeft: padding }}>
                    {this.handleValue(v, depth + 1)}
                </div>
            );
        } else if (typeof value === 'object') {
            return Object.entries(value).map(([k, v], i) =>
            <div key={k} style={{ paddingLeft: padding }}>
                {`${k}: `}
                    {this.handleValue(v, depth + 1)}
                </div>
            );
        } else {
            return <div style={{ paddingLeft: padding }}>{value}</div>;
        }
    }
    
    render() {
        console.log("Debugging", this.props.debugObject);
        const { debugObject } = this.props;
        if (typeof debugObject === 'string') {
            return <pre style={{ fontSize: "11px" }}>{debugObject}</pre>;
        } else {
            return (
                <pre style={{ fontSize: "11px" }}>
                    {Object.entries(debugObject).map(([key, value]) => (
                        <div key={key}>{`${key}: `}{this.handleValue(value)}</div>
                    ))}
                </pre>
            );
        }
    }
}

// If theres an explicit debugObject in scope, use that (index page)
// otherwise use the paper meta (inspect page)
ReactDOM.render(<Debugger debugObject={window.debugObject} />, document.getElementById('debugger'));
