import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Selection } from "./pages/Selection";
import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { QueueDisplayBoard } from "./pages/QueueDisplayBoard";
import { ModuleDashboard } from "./pages/ModuleDashboard";
import { ReceptionInterface } from "./pages/ReceptionInterface";
import { Default } from "./layouts/Default";
import { Authentication } from "./pages/Authentication";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";
import { useAuthStore } from "./stores/useAuthStore";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Bounce, ToastContainer } from "react-toastify";

// PENDING
// we are saving the date when the user takes the turn and finish it, but we should save
// that time using colombia time, check that out, for a better filtering later on

function App() {
   const { isAuth, checkingAuth, checkAuth } = useAuthStore();

   useEffect(() => {
      checkAuth();
   }, [checkAuth]);

   if (checkingAuth) {
      return <LoadingSpinner />;
   }

   const Wrapper = ({ children }: { children: ReactNode }) => {
      const location = useLocation();

      useLayoutEffect(() => {
         window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }, [location.pathname]);

      return children;
   };

   return (
      <>
         <Wrapper>
            <Routes>
               <Route element={<Default />}>
                  {/* PUBLIC */}
                  <Route
                     path="/"
                     element={
                        isAuth ? <Navigate to={"/selection"} /> : <Authentication />
                     }
                  />
                  <Route path="/queue" element={<QueueDisplayBoard />} />

                  {/* ERRORS */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="/*" element={<Navigate to={"/404"} />} />

                  {/* MANAGERS */}
                  <Route
                     path="/selection"
                     element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                           <Selection />
                        </ProtectedRoute>
                     }
                  />
                  <Route
                     path="/dashboard"
                     element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                           <Dashboard />
                        </ProtectedRoute>
                     }
                  />
                  <Route
                     path="/dashboard/:tab"
                     element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                           <Dashboard />
                        </ProtectedRoute>
                     }
                  />

                  {/* AGENTS */}
                  <Route
                     path="/modules"
                     element={
                        <ProtectedRoute allowedRoles={["agent"]}>
                           <ModuleDashboard />
                        </ProtectedRoute>
                     }
                  />

                  {/* RECEPTIONIST */}
                  <Route
                     path="/reception"
                     element={
                        <ProtectedRoute allowedRoles={["receptionist"]}>
                           <ReceptionInterface />
                        </ProtectedRoute>
                     }
                  />
               </Route>
            </Routes>
         </Wrapper>
         <ToastContainer
            className="mb-[-15px]"
            theme="colored"
            autoClose={4500}
            position="bottom-center"
            transition={Bounce}
            pauseOnHover={false}
         />
      </>
   );
}

export default App;
