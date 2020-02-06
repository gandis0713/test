import React from 'react';

export default function Topics (props) {
    var topics = [];
    var i = 0;
    while(i < props.topics.length) {
        topics.push(
            <li>
                <a 
                    href="/" 
                    data-id={props.topics[i].id}
                    onClick={function(e){
                        e.preventDefault();
                        props.changeContent(e.target.dataset.id);
                    }}>
                    {props.topics[i].value}
                </a>
            </li>
        )
        i = i + 1;
    }

    return (
        <list>
            <ul>
                {topics}
            </ul>
        </list>
    );
}