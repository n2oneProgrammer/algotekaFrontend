import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';

export default function CodeTab(props) {
    let list = props['codes']['codes'].map((value, id) => {
        return (
            <div key={id}>
                <SyntaxHighlighter language={props['codes']['syntax_code']}>
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
