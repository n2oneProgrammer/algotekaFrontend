import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';

export default function CodeTab(props) {
    let list = props['codes'].map((value, id) => {
        return (
            <div key={id}>
                <SyntaxHighlighter language="cpp">
                    {value}
                </SyntaxHighlighter>
            </div>
        )
    })
    return (
        <React.Fragment>
            <div>
                {list}
            </div>
        </React.Fragment>
    );
}
