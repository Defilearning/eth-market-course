import { ToastContainer } from "react-toastify";

import "@styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { Fragment } from "react";

const Noop = (props) => <Fragment>{props.children}</Fragment>;

function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout ?? Noop;

  return (
    <Layout>
      <ToastContainer />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
