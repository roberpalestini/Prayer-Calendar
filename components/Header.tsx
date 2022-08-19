import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react"
import { Navbar, Container } from 'react-bulma-components';

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

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
            <Navbar.Item href="/" active={isActive('/')} arrowless="true">Home</Navbar.Item>
            <Link href="/assembly">
              <Navbar.Item active={isActive('/assembly')} arrowless="true">Assemblies</Navbar.Item>
            </Link>
            <Link href="/person">
              <Navbar.Item active={isActive('/person')} arrowless="true">Contacts</Navbar.Item>
            </Link>
            <Link href="/ministry">
              <Navbar.Item active={isActive('/ministry')} arrowless="true">Ministries</Navbar.Item>
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
            <Navbar.Item href="/" active={isActive('/')} arrowless="true">Home</Navbar.Item>

            <Link href="/assembly">
              <Navbar.Item active={isActive('/assembly')} arrowless="true">Assemblies</Navbar.Item>
            </Link>
            <Link href="/person">
              <Navbar.Item active={isActive('/person')} arrowless="true">Contacts</Navbar.Item>
            </Link>
            <Link href="/ministry">
              <Navbar.Item active={isActive('/ministry')} arrowless="true">Ministries</Navbar.Item>
            </Link>
          </Navbar.Container>
          <Navbar.Container align="right">
            <Navbar.Item>{session.user.name} ({session.user.email})</Navbar.Item>
            <Navbar.Item onClick={() => signOut()}>Log Out</Navbar.Item>
          </Navbar.Container>
        </>
      );
  }

  return (
    <Navbar transparent="true">
      <Container>
        <Navbar.Brand>
          <Navbar.Item href="#">
            <img
              alt="Bulma: a modern CSS framework based on Flexbox"
              height="28"
              src="https://bulma.io/images/bulma-logo.png"
              width="112"
            />
          </Navbar.Item>
          <Navbar.Burger />
        </Navbar.Brand>
        <Navbar.Menu>
          {menu}
          </Navbar.Menu>
      </Container>
    </Navbar>
  );
};

export default Header;