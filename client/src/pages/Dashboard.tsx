import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "@/components/Container";
import { TimerWatch } from "@/components/TimerWatch";
import { PersonalSection } from "@/components/dasboard/Personal/Personal";
import { UserSection } from "@/components/dasboard/Users/User";

export const Dashboard = () => {
   const { tab } = useParams<{ tab?: string }>();
   const navigate = useNavigate();

   const activeTab = tab || "personal";

   const sections = [
      { id: "personal", name: "Personal" },
      { id: "modulos", name: "Módulos" },
      { id: "usuarios", name: "Usuarios" },
   ];

   const getVariant = (key: string) => (activeTab === key ? "default" : "secondary");

   const handleTabChange = (tabId: string) => {
      if (tabId === "personal") {
         navigate("/dashboard");
      } else {
         navigate(`/dashboard/${tabId}`);
      }
   };

   const renderContent = () => {
      switch (activeTab) {
         case "personal":
            return <PersonalSection />;
         case "modulos":
            return <PersonalSection />; // Replace with ModulesSection
         case "usuarios":
            return <UserSection />;
         default:
            return <PersonalSection />;
      }
   };

   return (
      <div className="flex-1">
         <Container>
            <div>
               <h1 className="text-2xl font-bold text-card-foreground mb-4 text-center">
                  Panel de Administración
               </h1>
               <TimerWatch />
            </div>
            <div className="my-6 bg-gray-100 dark:bg-gray-400/20 rounded-md p-1 inline-flex gap-1 shadow border">
               {sections.map((section) => (
                  <Button
                     key={section.id}
                     variant={getVariant(section.id)}
                     onClick={() => handleTabChange(section.id)}
                  >
                     {section.name}
                  </Button>
               ))}
            </div>
            <div className="flex flex-col">{renderContent()}</div>
         </Container>
      </div>
   );
};
