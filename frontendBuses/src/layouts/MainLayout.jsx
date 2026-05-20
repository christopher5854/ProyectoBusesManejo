import SidebarByRole from "../Components/SidebarByRole";

function MainLayout({children}){

   return(

      <div className="container">

         <SidebarByRole />

         <main>

            {children}

         </main>

      </div>

   )
}

export default MainLayout;