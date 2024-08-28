import React, { useEffect, useRef } from 'react';

function GoogleCustomSearch() {
  const searchBoxRef = useRef(null);

  useEffect(() => {
    const gcse = document.createElement('script');
    gcse.type = 'text/javascript';
    gcse.async = true;
    gcse.src = `https://cse.google.com/cse.js?cx=d0844e8de06de4d46 `;
    gcse.onload = () => {
      google.search.cse.element.render(searchBoxRef.current);
    };
    document.body.appendChild(gcse);
    return () => {
      document.body.removeChild(gcse);
    };
  }, []);

  return (
    <><div ref={searchBoxRef} /><script async src="https://cse.google.com/cse.js?cx=d0844e8de06de4d46"></script><div class="gcse-search"></div></>
  );
}

export default GoogleCustomSearch;
