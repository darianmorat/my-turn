import { Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { useLayoutEffect, type ReactNode } from "react";
import { QueueDisplayBoard } from "./pages/QueueDisplayBoard";
import { ModuleDashboard } from "./pages/ModuleDashboard";
import { ReceptionInterface } from "./pages/ReceptionInterface";

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
            <Route path="/1" element={<QueueDisplayBoard />} />
            <Route path="/2" element={<ModuleDashboard />} />
            <Route path="/3" element={<ReceptionInterface />} />
         </Routes>
      </Wrapper>
   );
}

export default App;
