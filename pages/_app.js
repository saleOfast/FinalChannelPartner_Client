import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'
import '../styles/styles.css'
import '../styles/style.css'
import '../styles/styleguide.css'
import '../styles/channelstyles.css'
import { store } from '../store/store'
import { Provider } from 'react-redux'
import { SSRProvider } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../Components/layout/layout';
import Tabs from '../Components/DMS/Tabs/Tabs';
import { hasCookie } from 'cookies-next';
import { Fragment } from 'react';
import CP_NavBar from '../Components/ChannelPartner/CP_NavBar/CP_NavBar';
import dynamic from "next/dynamic";
import Head from 'next/head';



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
      {hasCookie("channel") ? <CP_NavBar/>  : <Fragment></Fragment> }  
      <Layout Component={Component} pageProps={pageProps}  />
      {hasCookie("dms") ? <Tabs/>  : <Fragment></Fragment> }  
        </SSRProvider>
      </Provider>
  </>
  )

}


export default dynamic(()=>Promise.resolve(App),{ssr:false})

// export default App;