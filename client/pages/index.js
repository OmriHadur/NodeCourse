const LandingPage = (prop) => {
    console.log(prop);
    return prop.currentUser ? <h1>You are sign</h1> : <h1>you are not sigin</h1>
}

export default LandingPage;