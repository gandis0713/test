import React from 'react'

function Patient ({match}) {
  return (
    <div>
      Patient! {match.params.name}
    </div>
  );
}

export default Patient;