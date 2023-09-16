import Link from 'next/link'

export default ({ currentUser }) => {
    const links = [
        !currentUser && { lable: 'Sign Up', href: '/auth/signup' },
        !currentUser && { lable: 'Sign In', href: '/auth/signin' },
        currentUser && { lable: 'Sign out', href: '/auth/signout' }
    ]
        .filter(l => l)
        .map(({ lable, href }) => {
            return <li key={href} className='nav-item'>
                <Link className='nav-link' href={href}>{lable}</Link>
            </li>
        })

    return <nav className="navbar navbar-light bg-light">
        <Link href="/">
            GitTix
        </Link>
        <div className='d-flex jusify-content-end'>
            <ul className='nav d-flex align-items-center'>
                {links}
            </ul>
        </div>
    </nav>
}