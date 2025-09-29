import { Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { useLayoutEffect, type ReactNode } from "react";
import { QueueDisplayBoard } from "./pages/QueueDisplayBoard";
import { ModuleDashboard } from "./pages/ModuleDashboard";
import { ReceptionInterface } from "./pages/ReceptionInterface";
import { Default } from "./layouts/Default";
import { Authentication } from "./pages/Authentication";

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
            <Route element={<Default />}>
               <Route path="/" element={<HomePage />} />
               <Route path="/login" element={<Authentication />} />
               <Route path="/queue" element={<QueueDisplayBoard />} />
               <Route path="/modules" element={<ModuleDashboard />} />
               <Route path="/turns" element={<ReceptionInterface />} />
            </Route>
         </Routes>
      </Wrapper>
   );
}

export default App;
