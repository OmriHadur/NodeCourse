import 'bootstrap/dist/css/bootstrap.css';
import buildClient from "../api/buildClient";
import Header from '../components/header';

const AppComonent = ({ Component, pageProps, currentUser }) => {
    const all = { ...pageProps, currentUser };
    return <div>
        <Header currentUser={currentUser} />
        <div className='container'>
            <Component {...all} />
        </div>
    </div>
}

AppComonent.getInitialProps = async (appComonent) => {
    const client = buildClient(appComonent.ctx);
    const { data } = await client.get('/api/users/currentuser');
    let pageProps = {};
    if (appComonent.Component.getInitialProps)
        pageProps = await appComonent.Component.getInitialProps(appComonent.ctx, client, data.currentUser);

    return { pageProps, ...data };
}

export default AppComonent;