import React from 'react';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Navbar, Container } from 'react-bulma-components';
import Image from 'next/image';


const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  /* eslint-disable react/display-name */
  const NavbarItem = React.forwardRef<'Link', any>((props, ref) => (
    <Navbar.Item {...props} domRef={ref} />
  ));

  const { data: session, status } = useSession();
  let menu = (
    <>
      <Navbar.Container align="right">
        <Navbar.Item onClick={() => signIn()}>Log in</Navbar.Item>
      </Navbar.Container>
    </>
  );

  if (status === 'loading' || session) {
    menu = (
      <>
        <Navbar.Container>
          <Navbar.Item href="/" active={isActive('/')}>
            Home
          </Navbar.Item>
          <Link href="/assembly">
            <NavbarItem active={isActive('/assembly')}>Assemblies</NavbarItem>
          </Link>
          <Link href="/person">
            <NavbarItem active={isActive('/person')}>Contacts</NavbarItem>
          </Link>
          <Link href="/ministry">
            <NavbarItem active={isActive('/ministry')}>Ministries</NavbarItem>
          </Link>
        </Navbar.Container>
        <Navbar.Container align="right">
          <Navbar.Item onClick={() => signOut()}>Log Out</Navbar.Item>
        </Navbar.Container>
      </>
    );
  }

  if (session) {
    menu = (
      <>
        <Navbar.Container>
          <Link href="/">
            <NavbarItem href="/" active={isActive('/')}>
              Home
            </NavbarItem>
          </Link>
          <Link href="/assembly">
            <NavbarItem active={isActive('/assembly')}>Assemblies</NavbarItem>
          </Link>
          <Link href="/person">
            <NavbarItem active={isActive('/person')}>Contacts</NavbarItem>
          </Link>
          <Link href="/ministry">
            <NavbarItem active={isActive('/ministry')}>Ministries</NavbarItem>
          </Link>
        </Navbar.Container>
        <Navbar.Container align="right">
          <Navbar.Item>
            {session?.user?.name} ({session?.user?.email})
          </Navbar.Item>
          <Navbar.Item onClick={() => signOut()}>Log Out</Navbar.Item>
        </Navbar.Container>
      </>
    );
  }

  return (
    <Navbar transparent={true}>
      <Container>
        <Navbar.Brand>
          {/* <Navbar.Item href="#">
          <Image
          
        alt="Bulma: a modern CSS framework based on Flexbox"
layout='fixed' width='100' height='87'
        
        src={require(`../public/logo.png` )}
      />
          </Navbar.Item> */}
          <Navbar.Burger />
        </Navbar.Brand>
        <Navbar.Menu>{menu}</Navbar.Menu>
      </Container>
    </Navbar>
  );
};

export default Header;
