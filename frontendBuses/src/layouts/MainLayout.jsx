import SidebarByRole from "../Components/SidebarByRole";

function MainLayout({ children }) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#0f172a',
    }}>
      <SidebarByRole />
      <main style={{
        flex: 1,
        padding: '24px',
        overflowY: 'auto',
        backgroundColor: '#0f172a',
      }}>
        {children}
      </main>
    </div>
  );
}

export default MainLayout;