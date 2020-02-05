import React from 'react';

function Content(props) {

    var contents = [];
    var i = 0;
    while(i < props.list.length)
    {
        contents.push(<li><a href='1.html'>{props.list[i].value}</a></li>);
        i = i + 1;
    }
    return (
        <content>
            <ul>
                {contents}
            </ul>
        </content>
    );
}

export default Content;