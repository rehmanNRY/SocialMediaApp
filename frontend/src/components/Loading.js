import React from 'react';

const Loading = () => {
  return (
    <div className='h-screen w-screen fixed top-0 left-0 z-10 flex justify-between items-center bg-[#fff] preLoader'>
      <svg 
        version="1.1" 
        id="loader-1" 
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink" 
        x="0px" 
        y="0px" 
        width="40px" 
        height="40px" 
        viewBox="0 0 50 50" 
        className='mx-auto svg-rotate'
        xmlSpace="preserve"
      >
        <path 
          className="fill-black" 
          d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z" 
        />
      </svg>
    </div>
  );
}

export default Loading;