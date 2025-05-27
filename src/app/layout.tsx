// app/layout.tsx
import { ToastContainer } from 'react-toastify';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { Providers } from './Providers';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className='bg-background'>
        <Providers>
        {children}
        </Providers>
        <ToastContainer 
          position="top-center"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover={false}
          theme="light"
        />
      </body>
    </html>
  );
}