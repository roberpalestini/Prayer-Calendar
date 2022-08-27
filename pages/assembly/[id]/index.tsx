import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect, forwardRef } from 'react';

import { useSession, getSession, signIn } from 'next-auth/react';
import { prisma } from '../../../lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import LinkButton from '../../../components/LinkButton';

import {
  Form,
  Button,
  Heading,
  Card,
  Box,
  Icon,
  Block,
  Columns,
} from 'react-bulma-components';
import styled from 'styled-components';
import { Person, Assembly } from '.prisma/client';
import contactPeople from '../../api/person/contact';
import main from '../../api/person/contact';
import Link from 'next/link';

const Home: NextPage<Assembly> = ({ assembly }) => {
  const router = useRouter();
  const { assemblyId } = router.query;
  const [peopleSearch, setPeopleSearch] = useState<any[]>([]);
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <></>;
  }

  if (status === 'unauthenticated') {
    return signIn();
  }

  // const [searchContact, setSearchContact] = useState<string>('')
  // const [loadingSearch, setLoadingSearch] = useState<boolean>(false)

  // const refreshData = () => {
  //   router.replace(router.asPath)
  // }

  // async function handleSubmit(data: FormData) {
  //   // console.log(data)
  //   // console.log(newAssembly)

  //   try {
  //     if (newAssembly) {
  //       // Check input is not blank
  //       if (data.name) {
  //         // CREATE
  //         fetch('api/assembly/create', {
  //           body: JSON.stringify(data),
  //           headers: {
  //             'Content-Type': 'application/json'
  //           },
  //           method: 'POST'
  //         }).then(() => {
  //           setForm(blank)
  //           refreshData()
  //         })
  //       }
  //       else {
  //         alert("Title can not be blank")
  //       }
  //     }
  //     else {
  //       // UPDATE
  //       fetch(`api/assembly/${data.id}`, {
  //         body: JSON.stringify(data),
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         method: 'PUT'
  //       }).then(() => {
  //         setForm(blank)
  //         setNewAssembly(true)
  //         refreshData()
  //       })
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // async function updateAssembly(name, country, state, city, addressOne, addressTwo, schedule, id, contacts) {
  //   //console.log(name, country, id)
  //   setForm({ name, country, state, city, addressOne, addressTwo, schedule, id, contacts })
  //   setNewAssembly(false)
  // }

  async function deleteAssembly(id: string) {
    try {
      fetch(`/api/assembly/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      }).then(() => {
        router.push('/assembly');
      });
    } catch (error) {
      console.log(error);
    }
  }

  // function handleCancel() {
  //   setForm(blank)
  //   setNewAssembly(true)
  // }

  async function searchContacts(nameContact: string) {
    try {
      if (nameContact == '') {
        return setPeopleSearch([]);
      }
      fetch('/api/person/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/text',
        },
        body: nameContact,
      })
        .then((res) => res.json())
        .then((res) => {
          setPeopleSearch([...res]);
          setForm({
            ...form,
            contacts: res.map((e) => {
              return e.id;
            }),
          });
          console.log(form);
        });
    } catch (error) {
      console.log(error);
    }
  }

  const title = `${assembly.name} | Assemblies`;
  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <Heading size="1">{assembly.name}</Heading>
      <Columns>
        <Columns.Column>
          <Block>
            <Link href={`/assembly/${assembly.id}/edit`}>
              <LinkButton className="mr-3" color="link">
                Edit
              </LinkButton>
            </Link>
            <Button color="error" onClick={() => deleteAssembly(assembly.id)}>
              Delete
            </Button>
          </Block>
          <Block>
            <p>{assembly.addressOne}</p>
            <p>{assembly.addressTwo}</p>
            {assembly.city} {assembly.state}, {assembly.zip}
            <p>{assembly.country}</p>
          </Block>
          <Box>
            <strong className="pb-3 is-block">Schedule</strong>
            <p className="pre">{assembly.schedule}</p>
          </Box>
        </Columns.Column>
        <Columns.Column>
          {assembly.contacts ? '' : ''}
          {assembly.contacts.map((contact) => {
            return (
              <p key={contact.id} className="text-sm">
                <strong>Contact: </strong>
                {contact.name}
              </p>
            );
          })}
          <Heading size="2">Contacts</Heading>
          {peopleSearch.map((person) => {
            return (
              <Box key={person.id}>
                <li key={person.id} className="border-b border-gray-600 p-2">
                  <Form.Input value={person.id} type="hidden" />
                  <div className="flex jusify-between">
                    <div className="flex-1">
                      <h3 className="font-bold">
                        <strong>Name: </strong>
                        {person.name}
                      </h3>
                      <p className="text-sm">
                        <strong>Email: </strong>
                        {person.email}
                      </p>
                      <p className="text-sm">
                        <strong>Home Phone: </strong>
                        {person.homePhone}
                      </p>
                      <p className="text-sm">
                        <strong>Cell Phone: </strong>
                        {person.cellPhone}
                      </p>
                      <p className="text-sm">
                        <strong>Country: </strong>
                        {person.country}
                      </p>
                      <p className="text-sm">
                        <strong>State: </strong>
                        {person.state}
                      </p>
                      <p className="text-sm">
                        <strong>City: </strong>
                        {person.city}
                      </p>
                      <p className="text-sm">
                        <strong>Zip Code: </strong>
                        {person.zip}
                      </p>
                    </div>
                    <div style={{ float: 'right', marginTop: '-30px' }}></div>
                  </div>
                </li>
              </Box>
            );
          })}
        </Columns.Column>
      </Columns>
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const assemblyId = context.query;

  const assembly = await prisma.assembly.findUnique({
    where: { id: Number(assemblyId.id) },
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
      assembly,
    },
  };
};
