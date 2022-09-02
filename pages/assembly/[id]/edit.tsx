import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect, forwardRef } from 'react';
import { useSession, getSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { prisma } from '../../../lib/prisma';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import LinkButton from '../../../components/LinkButton';

import { Form, Button, Heading, Card, Box, Icon } from 'react-bulma-components';

import { Person, Assembly } from '.prisma/client';
import contactPeople from '../../api/person/contact';
import main from '../../api/person/contact';

interface FormData {
  name: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  addressOne: string;
  addressTwo: string;
  schedule: string;
  id: string;
  contacts?: any;
}

export default function Home({ assembly }) {
  // const Home: NextPage<Assembly> = ({ assembly }) => {
  const blank = {
    name: '',
    country: '',
    state: '',
    city: '',
    zip: '',
    addressOne: '',
    addressTwo: '',
    schedule: '',
    id: '',
  };
  const [form, setForm] = useState<FormData>({ ...assembly });

  const router = useRouter();

  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <></>;
  }

  if (status === 'unauthenticated') {
    return signIn();
  }

  async function handleSubmit(data: FormData) {
    try {
      // UPDATE
      fetch(`/api/assembly/${data.id}`, {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      }).then(() => {
        router.push(`/assembly/${data.id}`);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteAssembly(id: string) {
    try {
      fetch(`api/assembly/${id}`, {
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

  const title = `Editing ${assembly.name}`;
  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <Heading size={1}>{title}</Heading>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(form);
        }}
      >
        <Form.Field>
          <Form.Label>Name</Form.Label>
          <Form.Input
            type="text"
            placeholder="Christian Assembly"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Form.Field>
        <Form.Field>
          <Form.Label>Country</Form.Label>
          <Form.Input
            type="text"
            placeholder="USA"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
        </Form.Field>
        <Form.Field>
          <Form.Label>State/Provice</Form.Label>
          <Form.Input
            type="text"
            placeholder="Illinois"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          />
        </Form.Field>
        <Form.Field>
          <Form.Label>City</Form.Label>
          <Form.Input
            type="text"
            placeholder="Chicago"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </Form.Field>
        <Form.Field>
          <Form.Label>Zip Code</Form.Label>
          <Form.Input
            type="text"
            placeholder="60922"
            value={form.zip}
            onChange={(e) => setForm({ ...form, zip: e.target.value })}
          />
        </Form.Field>
        <Form.Field>
          <Form.Label>Address Line One</Form.Label>
          <Form.Input
            type="text"
            placeholder="One Drive"
            value={form.addressOne}
            onChange={(e) => setForm({ ...form, addressOne: e.target.value })}
          />
        </Form.Field>
        <Form.Field>
          <Form.Label>Address Line Two</Form.Label>
          <Form.Input
            type="text"
            placeholder="PO Box 1"
            value={form.addressTwo}
            onChange={(e) => setForm({ ...form, addressTwo: e.target.value })}
          />
        </Form.Field>
        <Form.Field>
          <Form.Label>Schedule</Form.Label>
          <Form.Textarea
            placeholder="Content"
            value={form.schedule}
            onChange={(e) => setForm({ ...form, schedule: e.target.value })}
          ></Form.Textarea>
        </Form.Field>

        <ul></ul>

        <br></br>
        <Form.Field kind="group">
          <Form.Control>
            <>
              <Form.Input type="hidden" value={form.id} />
              <Button color="link" type="submit" className="mr-3">
                Update
              </Button>
              <Link href={`/assembly/${assembly.id}`}>
                <LinkButton color="link" colorVariant="light">
                  Cancel
                </LinkButton>
              </Link>
            </>
          </Form.Control>
        </Form.Field>
      </form>

      <br></br>
    </Layout>
  );
}

// export default Home;

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
