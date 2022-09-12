import Head from 'next/head';
import { useState, useEffect, forwardRef } from 'react';
import { useSession, getSession, signIn } from 'next-auth/react';
import Link from 'next/link';

import { prisma } from '../../lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import LinkButton from '../../components/LinkButton';
import { Form, Button, Heading, Card, Box, Icon } from 'react-bulma-components';
import styled from 'styled-components';
import { Person, Assembly } from '.prisma/client';
import contactPeople from '../api/person/contact';
import main from '../api/person/contact';

// Array interface
interface Assemblies {
  assemblies: Assembly;
}

export default function Home({ assemblies }) {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <></>;
  }

  if (status === 'unauthenticated') {
    return signIn();
  }

  return (
    <Layout>
      <Head>
        <title>Assemblies</title>
      </Head>
      <Heading size={1}>Assemblies</Heading>
      <Link href="/assembly/new">
        <LinkButton color="link">New</LinkButton>
      </Link>
      <ul id="test">
        {assemblies.map((assembly: any) => (
          <Box
            key={assembly.id}
            style={{ marginTop: '20px', marginBottom: '20px' }}
          >
            <li className="border-b border-gray-600 p-2">
              <div className="flex jusify-between">
                <div className="flex-1" style={{ display: 'block' }}>
                  <h3 className="font-bold">
                    <strong>Name: </strong>
                    {assembly.name}
                  </h3>

                  <p className="text-sm">
                    <strong>Country: </strong>
                    {assembly.country}
                  </p>
                  <p className="text-sm">
                    <strong>State: </strong>
                    {assembly.state}
                  </p>
                  <p className="text-sm">
                    <strong>City: </strong>
                    {assembly.city}
                  </p>
                  <p className="text-sm">
                    <strong>Zip Code: </strong>
                    {assembly.zip}
                  </p>
                  <p className="text-sm">
                    <strong>Address One: </strong>
                    {assembly.addressOne}
                  </p>
                  <p className="text-sm">
                    <strong>Address Two: </strong>
                    {assembly.addressOne}
                  </p>
                  <p className="text-sm">
                    <strong>Schelude: </strong>
                    {assembly.schedule}
                  </p>
                  {assembly.contacts.map((contact) => {
                    return (
                      <p key={contact.id} className="text-sm">
                        <strong>Contact: </strong>
                        {contact.name}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div style={{ float: 'right', marginTop: '-30px' }}>
                <Link href={`/assembly/${assembly.id}`}>
                  <LinkButton color="link" className="mr-3">
                    Open
                  </LinkButton>
                </Link>
                <Link href={`/assembly/${assembly.id}/edit`}>
                  <LinkButton className="mr-3" color="link">
                    Edit
                  </LinkButton>
                </Link>
              </div>
            </li>
          </Box>
        ))}
      </ul>
    </Layout>
  );
}

// export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const assemblies = await prisma?.assembly.findMany({
    select: {
      id: true,
      name: true,
      country: true,
      state: true,
      city: true,
      zip: true,
      addressOne: true,
      addressTwo: true,
      schedule: true,

      contacts: {
        select: {
          name: true,
          email: true,
          id: true,
        },
      },
    },
  });

  return {
    props: {
      assemblies,
    },
  };
};
