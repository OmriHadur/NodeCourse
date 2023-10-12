import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/useRequest';

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expriresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };
        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);
        return () => clearInterval(timerId);
    }, []);

    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: { orderId: order.id },
        onSuccess: (order) => Router.push('/orders')
    });


    if (timeLeft > 0)
        return (<div>
            expires in {timeLeft} sec
            <StripeCheckout
                token={({ id }) => doRequest({ token: id })}
                stripeKey="pk_test_51O013AHkZuBLM6y4qyy0Sj4GRLBVoyy7j2CgDgmiJVUAMnOpvyj4wuC6SiNXfAmC96OyHPY96rpc9PuPShgrV8zb00nsrlWzbC"
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
            {errors}
        </div>)
    else
        return <div>expired</div>
};

OrderShow.getInitialProps = async (contex, client) => {
    const { orderId } = contex.query;
    const { data } = await client.get('/api/orders/' + orderId);
    return { order: data };
}
export default OrderShow