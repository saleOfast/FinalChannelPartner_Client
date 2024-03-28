import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'
import '../styles/styles.css'
import { store } from '../store/store'
import { Provider } from 'react-redux'
import { SSRProvider } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../Components/layout/layout';



function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <SSRProvider>
        <ToastContainer
                  position="top-right"
                  autoClose={500}
                  limit={1}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light" />
      <Layout Component={Component} pageProps={pageProps}  />
        </SSRProvider>
      </Provider>
  </>
  )

}



export default App;