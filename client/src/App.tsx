import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Selection } from "./pages/Selection";
import { useLayoutEffect, type ReactNode } from "react";
import { QueueDisplayBoard } from "./pages/QueueDisplayBoard";
import { ModuleDashboard } from "./pages/ModuleDashboard";
import { ReceptionInterface } from "./pages/ReceptionInterface";
import { Default } from "./layouts/Default";
import { Authentication } from "./pages/Authentication";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";

// PENDING
// we are saving the date when the user takes the turn and finish it, but we should save
// that time using colombia time, check that out, for a better filtering later on

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
               <Route path="/404" element={<NotFound />} />
               <Route path="/*" element={<Navigate to={"/404"} />} />

               {/* MANAGERS */}
               {/* they should have access to every single page, and also able to */}
               {/* manage the process as the other roles, but he creates the  */}
               {/* agents, receptionists and other managers */}
               <Route path="/" element={<Authentication />} />

               <Route path="/selection" element={<Selection />} />
               <Route path="/queue" element={<QueueDisplayBoard />} />
               <Route path="/dashboard" element={<Dashboard />} />
               <Route path="/dashboard/:tab" element={<Dashboard />} />

               {/* AGENTS */}
               {/* A page per agent should be created and a way to assign the agent */}
               {/* to that specific module also should be added */}
               <Route path="/modules" element={<ModuleDashboard />} />

               {/* RECEPTIONIST */}
               {/* They create the turns and users... no more interaction, and this */}
               {/* is the only page they should have access to */}
               <Route path="/reception" element={<ReceptionInterface />} />
            </Route>
         </Routes>
      </Wrapper>
   );
}

export default App;
