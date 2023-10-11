import Router from 'next/router'
import useRequest from '../../hooks/useRequest';

const OrderShow = ({ order }) => {

};

OrderShow.getInitialProps = async (contex, client) => {
    const { orderId } = contex.query;
    const { data } = await client.get('/api/orders/' + orderId);
    return { order: data };
}
export default OrderShow