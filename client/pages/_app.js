import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
import Header from "../components/header";
const app = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

app.getInitialProps = async (appCtx) => {
  let response;
  try {
    if (typeof window === "undefined") {
      response = await axios.get(
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
        {
          headers: appCtx.ctx.req.headers,
        }
      );
    } else {
      response = await axios.get("/api/users/currentuser");
    }
  } catch (err) {
    response = { data: { currentUser: null } };
  }

  let pageProps = {};
  if (appCtx.Component.getInitialProps) {
    pageProps = await appCtx.Component.getInitialProps(appCtx.ctx);
  }

  return { pageProps, currentUser: response.data.currentUser };
};

export default app;
