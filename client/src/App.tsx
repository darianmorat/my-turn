import { Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { useLayoutEffect, type ReactNode } from "react";

function App() {
   const Wrapper = ({ children }: { children: ReactNode }) => {
      const location = useLocation();

      useLayoutEffect(() => {
         window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }, [location.pathname]);

      return children;
   };

   return (
      <Wrapper>
         <Routes>
            <Route path="/" element={<HomePage />} />
         </Routes>
      </Wrapper>
   );
}

export default App;
