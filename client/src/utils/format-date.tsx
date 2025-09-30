export const formatDate = (date?: string) => {
   if (!date) {
      return "Fecha no disponible";
   }

   return new Date(date).toLocaleDateString("es", {
      year: "numeric",
      month: "short",
      day: "2-digit",
   });
};
