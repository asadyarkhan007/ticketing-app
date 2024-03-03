import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const app = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

app.getInitialProps = async (appCtx) => {
  const client = buildClient(appCtx.ctx);
  let pageProps = {};
  try {
    const { data } = await client.get("/api/users/currentuser");

    if (appCtx.Component.getInitialProps) {
      pageProps = await appCtx.Component.getInitialProps(
        appCtx.ctx,
        client,
        data.currentUser
      );
    }
    return { pageProps, ...data };
  } catch (err) {
    return { pageProps };
  }
};

export default app;
