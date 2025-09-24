import { useEffect } from "react";
import { Clock, Users, ArrowRight } from "lucide-react";
import { useQueueStore } from "@/stores/useQueueStore";

export const QueueDisplayBoard = () => {
   const {
      waitingTurns,
      currentlyServed,
      modules,
      stats,
      getWaitingTurns,
      getCurrentlyServed,
      getModules,
      getStats,
   } = useQueueStore();

   // Auto-refresh every 5 seconds
   useEffect(() => {
      const fetchData = async () => {
         await Promise.all([
            getWaitingTurns(),
            getCurrentlyServed(),
            getModules(),
            getStats(),
         ]);
      };

      fetchData();
      const interval = setInterval(fetchData, 5000);

      return () => clearInterval(interval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   // Get next 3 people in queue with predicted modules
   const getNextTurnsWithModules = () => {
      const availableModules = modules.filter((m) => m.isActive);
      const busyModuleIds = currentlyServed.map((turn) => turn.moduleId).filter(Boolean);
      const availableModuleIds = availableModules
         .filter((m) => !busyModuleIds.includes(m.id))
         .map((m) => m.id);

      return waitingTurns.slice(0, 3).map((turn, index) => {
         let predictedModule = null;

         if (index === 0 && availableModuleIds.length > 0) {
            // First person goes to first available module
            predictedModule = availableModules.find(
               (m) => m.id === availableModuleIds[0],
            );
         } else if (index < availableModuleIds.length) {
            // Others go to remaining available modules
            predictedModule = availableModules.find(
               (m) => m.id === availableModuleIds[index],
            );
         }

         return {
            ...turn,
            predictedModule,
         };
      });
   };

   const nextTurns = getNextTurnsWithModules();
   const currentTime = new Date().toLocaleTimeString();

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-8">
         {/* Header */}
         <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Queue Management System</h1>
            <div className="flex items-center justify-center gap-4 text-lg">
               <div className="flex items-center gap-2">
                  <Clock size={20} />
                  <span>{currentTime}</span>
               </div>
               <div className="flex items-center gap-2">
                  <Users size={20} />
                  <span>{stats?.waiting || 0} waiting</span>
               </div>
            </div>
         </div>

         {/* Currently Being Served */}
         <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">
               🏢 Currently Being Served
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {modules.map((module) => {
                  const serving = currentlyServed.find(
                     (turn) => turn.moduleId === module.id,
                  );

                  return (
                     <div
                        key={module.id}
                        className={`p-6 rounded-xl shadow-lg border-2 transition-all ${
                           serving
                              ? "bg-green-600 border-green-400 animate-pulse"
                              : "bg-gray-700 border-gray-500"
                        }`}
                     >
                        <div className="text-center">
                           <h3 className="text-lg font-bold mb-2">{module.name}</h3>
                           {serving ? (
                              <div>
                                 <div className="text-3xl font-bold text-yellow-300 mb-1">
                                    {serving.ticketCode}
                                 </div>
                                 <div className="text-sm opacity-90">
                                    {serving.user.name}
                                 </div>
                                 <div className="text-xs opacity-75 mt-1">
                                    Serving since{" "}
                                    {new Date(serving.calledAt!).toLocaleTimeString()}
                                 </div>
                              </div>
                           ) : (
                              <div className="text-gray-300">
                                 <div className="text-xl mb-1">Available</div>
                                 <div className="text-sm">Waiting for next customer</div>
                              </div>
                           )}
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>

         {/* Next in Queue */}
         <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">
               🎯 Next to Be Called
            </h2>

            {nextTurns.length === 0 ? (
               <div className="text-center py-12 bg-gray-800 rounded-xl">
                  <div className="text-xl text-gray-400">No one waiting in queue</div>
               </div>
            ) : (
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {nextTurns.map((turn, index) => (
                     <div
                        key={turn.id}
                        className={`relative p-6 rounded-xl shadow-lg border-2 transition-all ${
                           index === 0
                              ? "bg-yellow-600 border-yellow-400 transform scale-105"
                              : "bg-blue-700 border-blue-500"
                        }`}
                     >
                        {index === 0 && (
                           <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              NEXT
                           </div>
                        )}

                        <div className="text-center">
                           <div className="text-3xl font-bold mb-2">
                              {turn.ticketCode}
                           </div>
                           <div className="text-lg mb-2">{turn.user.name}</div>
                           <div className="text-sm opacity-75 mb-3">
                              Position: #{turn.queueNumber}
                           </div>

                           {turn.predictedModule && (
                              <div className="flex items-center justify-center gap-2 bg-black bg-opacity-30 rounded-lg p-2">
                                 <ArrowRight size={16} />
                                 <span className="font-semibold">
                                    {turn.predictedModule.name}
                                 </span>
                              </div>
                           )}

                           {!turn.predictedModule && (
                              <div className="bg-gray-600 rounded-lg p-2 text-sm">
                                 Waiting for available module
                              </div>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>

         {/* Queue Statistics */}
         {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-blue-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">{stats.waiting}</div>
                  <div className="text-sm opacity-75">Waiting</div>
               </div>
               <div className="bg-green-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">{stats.beingServed}</div>
                  <div className="text-sm opacity-75">Being Served</div>
               </div>
               <div className="bg-purple-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">{stats.completed}</div>
                  <div className="text-sm opacity-75">Completed</div>
               </div>
               <div className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold">{stats.totalToday}</div>
                  <div className="text-sm opacity-75">Total Today</div>
               </div>
            </div>
         )}
      </div>
   );
};
