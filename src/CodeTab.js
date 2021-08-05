import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {Button, Icon} from "@material-ui/core";

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
                {props['accessToken'] != null ? (
                    <div>
                        <Button
                            style={{width: "100%"}}
                            onClick={() => {
                                props['setLanguageIdDialog'](props['codes']['language_id']);
                                props['setOpenAddCodeDialog'](true);
                            }}
                        >
                            <Icon style={{
                                fontSize: 30, display: "block",
                                margin: "0 auto"
                            }}>add_circle</Icon>
                        </Button>
                    </div>
                ) : (
                    ""
                )}

            </div>
        </React.Fragment>
    );
}
