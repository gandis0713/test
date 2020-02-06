import React from 'react';

export default function Content(props) {
    return (
        <content>
            <h2>
                {props.title}
            </h2>
            {props.decs}
        </content>
    );
}