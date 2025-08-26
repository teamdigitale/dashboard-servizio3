function App() {
  return (
    <div>
      <div className='grid grid-cols-1 gap-4 m-6 ml-2 sm:grid-cols-2 lg:grid-cols-3'>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            className='flex items-center justify-center w-full  h-24 bg-base-300 text-content rounded-md  shadow-md'
            key={`stat-${item}`}
          >
            <div className='text-2xl '>Stat {item}</div>
          </div>
        ))}
      </div>
      <div className='grid grid-cols-1 gap-4 m-6 ml-2 '>
        {[1].map((item) => (
          <div
            className='flex items-center justify-center w-full  h-94 bg-base-300 text-content rounded-md  shadow-md'
            key={`fullChart-${item}`}
          >
            <div className='text-2xl '>Full Chart {item}</div>
          </div>
        ))}
      </div>
      <div className='grid grid-cols-1 gap-4 m-6 ml-2 lg:grid-cols-2'>
        {[1, 2, 3, 4].map((item) => (
          <div
            className='flex items-center justify-center w-full  h-94 bg-base-300 text-content rounded-md  shadow-md'
            key={`Chart-${item}`}
          >
            <div className='text-2xl '>Chart {item}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
