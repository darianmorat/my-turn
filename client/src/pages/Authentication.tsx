import { LoginForm } from "@/components/login-form";
import authImage from "../assets/authImage.jpg";
// import sena_logo from "../assets/logo-sena.png";
import { ModeToggle } from "@/components/ModeToggle";

export const Authentication = () => {
   return (
      <div className="grid lg:grid-cols-2">
         {/* CUSTOM BACKGROUND */}
         <div className="min-h-screen w-full relative">
            {/* Light mode */}
            {/* Diagonal Fade Grid Background - Top Right */}
            <div
               className="absolute inset-0 z-0 block dark:hidden"
               style={{
                  backgroundImage: `
                    linear-gradient(to right, #ddd 1px, transparent 1px),
                    linear-gradient(to bottom, #ddd 1px, transparent 1px)
                  `,
                  backgroundSize: "32px 32px",
                  WebkitMaskImage:
                     "radial-gradient(ellipse 60% 60% at 100% 0%, #000 50%, transparent 90%)",
                  maskImage:
                     "radial-gradient(ellipse 60% 60% at 100% 0%, #000 50%, transparent 90%)",
               }}
            />
            {/* Diagonal Fade Grid Background - Bot Left */}
            <div
               className="absolute inset-0 z-0 block dark:hidden"
               style={{
                  backgroundImage: `
                    linear-gradient(to right, #ddd 1px, transparent 1px),
                    linear-gradient(to bottom, #ddd 1px, transparent 1px)
                  `,
                  backgroundSize: "32px 32px",
                  WebkitMaskImage:
                     "radial-gradient(ellipse 60% 60% at 0% 100%, #000 50%, transparent 90%)",
                  maskImage:
                     "radial-gradient(ellipse 60% 60% at 0% 100%, #000 50%, transparent 90%)",
               }}
            />
            {/* Dark mode */}
            {/* Diagonal Fade Grid Background - Top Right */}
            <div
               className="absolute inset-0 z-0 hidden dark:block"
               style={{
                  backgroundImage: `
                    linear-gradient(to right, #353535 1px, transparent 1px),
                    linear-gradient(to bottom, #353535 1px, transparent 1px)
                  `,
                  backgroundSize: "32px 32px",
                  WebkitMaskImage:
                     "radial-gradient(ellipse 60% 60% at 100% 0%, #000 50%, transparent 90%)",
                  maskImage:
                     "radial-gradient(ellipse 60% 60% at 100% 0%, #000 50%, transparent 90%)",
               }}
            />
            {/* Diagonal Fade Grid Background - Bot Left */}
            <div
               className="absolute inset-0 z-0 hidden dark:block"
               style={{
                  backgroundImage: `
                    linear-gradient(to right, #353535 1px, transparent 1px),
                    linear-gradient(to bottom, #353535 1px, transparent 1px)
                  `,
                  backgroundSize: "32px 32px",
                  WebkitMaskImage:
                     "radial-gradient(ellipse 60% 60% at 0% 100%, #000 50%, transparent 90%)",
                  maskImage:
                     "radial-gradient(ellipse 60% 60% at 0% 100%, #000 50%, transparent 90%)",
               }}
            />
            {/* Your Content/Components */}
            <div className="relative flex flex-col gap-4 p-6 md:p-10 absolute w-full min-h-screen">
               <div className="flex justify-center gap-2 md:justify-start">
                  {/* <img src={sena_logo} className="w-40" alt="Sena Logo" /> */}
                  {/* <img src={logo} className="h-8 size-10 dark:invert" alt="Ticsor Logo" /> */}
                  {/* <span className="self-center font-semibold whitespace-nowrap dark:text-white"> */}
                  {/*    Ticsor App */}
                  {/* </span> */}
               </div>
               <div className="flex flex-1 items-center justify-center">
                  <div className="w-full max-w-xs">
                     <LoginForm />
                  </div>
               </div>
            </div>
         </div>
         {/* CUSTOM BACKGROUND */}
         <div className="bg-muted relative hidden lg:block">
            <img
               src={authImage}
               alt="Image"
               className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.40] dark:grayscale object-[30%]"
            />
         </div>

         <div className="absolute bottom-0 right-0 m-4 rounded-md shadow">
            <ModeToggle />
         </div>
      </div>
   );
};
