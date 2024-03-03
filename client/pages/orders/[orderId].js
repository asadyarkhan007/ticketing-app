import { useEffect, useState } from "react";

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const findTimLeft = () => {
      const msLeft = new Date(order.expiredAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimLeft();
    const timerId = setInterval(findTimLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  return <div>Time left to Pay {timeLeft} seconds</div>;
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};
export default OrderShow;
