import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  console.log('App component rendering...');
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Hello World - App is loading!</div>} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
