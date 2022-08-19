import React, { ReactNode } from "react";
import Header from "./Header";
import Head from 'next/head';
import { Container } from 'react-bulma-components';

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <>
    <Head>
      <title>Prayer Calendar</title>
    </Head>
    <Header />
    <Container>
      {props.children}
    </Container>
  </>
);

export default Layout;
