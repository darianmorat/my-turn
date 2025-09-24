import { useEffect } from "react";
import { UserCheck, Clock, CheckCircle, AlertCircle, Users, Phone } from "lucide-react";
import { useQueueStore } from "@/stores/useQueueStore";

export const ModuleDashboard = () => {
   const {
      modules,
      currentlyServed,
      waitingTurns,
      stats,
      callNext,
      completeTurn,
      getCurrentlyServed,
      getModules,
      getWaitingTurns,
      getStats,
      isLoading,
   } = useQueueStore();

   // Auto-refresh every 3 seconds
   useEffect(() => {
      const fetchData = async () => {
         await Promise.all([
            getModules(),
            getCurrentlyServed(),
            getWaitingTurns(),
            getStats(),
         ]);
      };

      fetchData();
      const interval = setInterval(fetchData, 3000);

      return () => clearInterval(interval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleCallNext = async (moduleId: number) => {
      const turn = await callNext(moduleId);
      if (turn) {
         // Show notification or announcement
         console.log(`Called ${turn.ticketCode} to Module ${moduleId}`);
      }
   };

   const handleComplete = async (turnId: number) => {
      await completeTurn(turnId);
   };

   const getModuleStatus = (moduleId: number) => {
      const serving = currentlyServed.find((turn) => turn.moduleId === moduleId);
      return serving;
   };

   const getNextInQueue = () => {
      return waitingTurns[0] || null;
   };

   return (
      <div className="min-h-screen bg-gray-50 p-6">
         {/* Header */}
         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
               <h1 className="text-2xl font-bold text-gray-800">
                  Module Management Dashboard
               </h1>
               <div className="flex items-center gap-6">
                  <div className="text-center">
                     <div className="text-2xl font-bold text-blue-600">
                        {stats?.waiting || 0}
                     </div>
                     <div className="text-sm text-gray-500">Waiting</div>
                  </div>
                  <div className="text-center">
                     <div className="text-2xl font-bold text-green-600">
                        {stats?.beingServed || 0}
                     </div>
                     <div className="text-sm text-gray-500">Being Served</div>
                  </div>
                  <div className="text-center">
                     <div className="text-2xl font-bold text-purple-600">
                        {stats?.completed || 0}
                     </div>
                     <div className="text-sm text-gray-500">Completed</div>
                  </div>
               </div>
            </div>
         </div>

         {/* Next in Queue Info */}
         {getNextInQueue() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
               <div className="flex items-center gap-3">
                  <Users className="text-yellow-600" size={24} />
                  <div>
                     <div className="font-semibold text-yellow-800">
                        Next in Queue: {getNextInQueue()!.ticketCode}
                     </div>
                     <div className="text-sm text-yellow-600">
                        {getNextInQueue()!.user.name} - Position #
                        {getNextInQueue()!.queueNumber}
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Module Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module) => {
               const serving = getModuleStatus(module.id);
               const isAvailable = !serving;
               const canCallNext = isAvailable && waitingTurns.length > 0;

               return (
                  <div
                     key={module.id}
                     className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                     {/* Module Header */}
                     <div
                        className={`p-4 ${isAvailable ? "bg-green-500" : "bg-blue-500"} text-white`}
                     >
                        <div className="flex items-center justify-between">
                           <h3 className="font-bold text-lg">{module.name}</h3>
                           <div
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                 isAvailable ? "bg-green-600" : "bg-blue-600"
                              }`}
                           >
                              {isAvailable ? "Available" : "Busy"}
                           </div>
                        </div>
                        {module.description && (
                           <p className="text-sm opacity-90 mt-1">{module.description}</p>
                        )}
                     </div>

                     {/* Module Content */}
                     <div className="p-4">
                        {serving ? (
                           /* Currently Serving */
                           <div className="space-y-4">
                              <div className="text-center">
                                 <div className="text-2xl font-bold text-blue-600 mb-1">
                                    {serving.ticketCode}
                                 </div>
                                 <div className="font-medium text-gray-800">
                                    {serving.user.name}
                                 </div>
                                 <div className="text-sm text-gray-500">
                                    ID: {serving.user.nationalId}
                                 </div>
                              </div>

                              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                 <Clock size={16} />
                                 <span>
                                    Started:{" "}
                                    {new Date(serving.calledAt!).toLocaleTimeString()}
                                 </span>
                              </div>

                              <button
                                 onClick={() => handleComplete(serving.id)}
                                 disabled={isLoading}
                                 className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                              >
                                 <CheckCircle size={18} />
                                 Complete Service
                              </button>
                           </div>
                        ) : (
                           /* Available */
                           <div className="space-y-4">
                              <div className="text-center py-6">
                                 <UserCheck
                                    size={48}
                                    className="mx-auto text-gray-300 mb-2"
                                 />
                                 <div className="text-gray-500">
                                    Ready for next customer
                                 </div>
                              </div>

                              <button
                                 onClick={() => handleCallNext(module.id)}
                                 disabled={!canCallNext || isLoading}
                                 className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                                    canCallNext
                                       ? "bg-blue-500 hover:bg-blue-600 text-white"
                                       : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                 }`}
                              >
                                 <Phone size={18} />
                                 {canCallNext ? "Call Next" : "No One Waiting"}
                              </button>

                              {canCallNext && getNextInQueue() && (
                                 <div className="text-center text-sm text-gray-600">
                                    Next: {getNextInQueue()!.ticketCode} (
                                    {getNextInQueue()!.user.name})
                                 </div>
                              )}
                           </div>
                        )}
                     </div>

                     {/* Module Footer */}
                     <div className="px-4 py-2 bg-gray-50 border-t">
                        <div className="text-xs text-gray-500 text-center">
                           {module.agentName
                              ? `Agent: ${module.agentName}`
                              : "No agent assigned"}
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>

         {/* Quick Actions */}
         <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
               <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
               >
                  <AlertCircle size={18} />
                  Refresh All
               </button>

               <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Auto-refresh every 3 seconds</span>
               </div>
            </div>
         </div>
      </div>
   );
};
