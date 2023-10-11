import Router from 'next/router'
import useRequest from '../../hooks/useRequest';

const TicketShow = ({ ticket }) => {

    const { doRequest, errors } = useRequest({
        url: '/api/orders',
        method: 'post',
        body: { ticketId: ticket.id },
        onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
    });

    return (
        <div>
            <h1>{ticket.title}</h1>
            <h4>price: {ticket.price}</h4>
            <button onClick={doRequest} className='btn btn-primary'>Purchase</button>
        </div>
    );
};

TicketShow.getInitialProps = async (contex, client) => {
    const { ticketId } = contex.query;
    const { data } = await client.get('/api/tickets/' + ticketId);
    return { ticket: data };
}
export default TicketShow