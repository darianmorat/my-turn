import { AssignTurnForm } from "@/components/pages/AssignTurnForm";
import { CreateUserForm } from "@/components/pages/CreateUserForm";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/useUserStore";
import { useEffect, useState } from "react";

export const HomePage = () => {
   const { getUsers, users } = useUserStore();
   const [modal, setModal] = useState<string>("");

   const handleModal = (value: string) => setModal(value);
   const closeModal = () => setModal("");

   useEffect(() => {
      getUsers();
   }, [getUsers]);

   return (
      <>
         <div className="flex flex-col gap-3 m-3">
            {/* Modules */}
            <div className="bg-red-200 p-3 flex flex-col items-center">
               <h2 className="font-bold uppercase">Modules</h2>
               <div className="flex gap-3">
                  {/* {modules.map((module) => ( */}
                  {/*    <div */}
                  {/*       key={module.id} */}
                  {/*       className="border-3 p-3 border-black/40 w-40 rounded-md shadow" */}
                  {/*    > */}
                  {/*       <h3 className="font-medium">Module {module.id}</h3> */}
                  {/*       <p className="font-thin">Current: #</p> */}
                  {/*    </div> */}
                  {/* ))} */}
               </div>
            </div>

            {/* Waiting + Reception */}
            <div className="flex gap-3">
               <div className="bg-green-200 flex-1 p-3 flex flex-col items-center">
                  <h2 className="font-bold uppercase">Waiting line</h2>
                  {/* {users.slice(0, 3).map((user) => ( */}
                  {/*    <div key={user.id} className="font-mono"> */}
                  {/*       #{user.id} – {user.name} */}
                  {/*    </div> */}
                  {/* ))} */}
               </div>
               <div className="bg-blue-200 flex-1 p-3 flex flex-col items-center">
                  <h2 className="font-bold uppercase">Reception</h2>
                  <div className="flex gap-3">
                     <Button variant="outline" onClick={() => handleModal("create")}>
                        Create user
                     </Button>
                     <Button variant="outline" onClick={() => handleModal("turn")}>
                        Assign turn
                     </Button>
                     <Button variant={"destructive"} onClick={() => console.log(users)}>
                        Show all users
                     </Button>
                  </div>
               </div>
            </div>
         </div>

         {/* Modal */}
         {modal === "create" && <CreateUserForm closeModal={closeModal} />}
         {modal === "turn" && <AssignTurnForm closeModal={closeModal} />}
      </>
   );
};
