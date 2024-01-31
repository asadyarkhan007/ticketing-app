import axios from "axios";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

LandingPage.getInitialProps = async (ctx) => {
  try {
    if (typeof window === "undefined") {
      const { data } = await axios.get(
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
        {
          headers: ctx.req.headers,
        }
      );
      return data;
    } else {
      const { data } = await axios.get("/api/users/currentuser");
      return data;
    }
  } catch (err) {
    return { currentUser: null };
  }
};

export default LandingPage;
