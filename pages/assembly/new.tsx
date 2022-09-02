import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useSession, getSession, signIn } from 'next-auth/react';
import Link from 'next/link';

import { prisma } from '../../lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { Form, Button, Heading, Card, Box, Icon } from 'react-bulma-components';
import styled from 'styled-components';
import { Person, Assembly } from '.prisma/client';
import contactPeople from '../api/person/contact';
import main from '../api/person/contact';

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
}

interface Assemblies {
  assemblies: Assembly;
}

export default function Home({ assemblies }) {
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
  const [form, setForm] = useState<FormData>(blank);
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
      if (data.name) {
        // CREATE
        fetch('/api/assembly/create', {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
        })
          .then((res) => res.json())
          .then((res) => {
            router.push(`/assembly/${res.id}`);
          });
      } else {
        alert('Title can not be blank');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const title = 'New Assembly';
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
        <Form.Field kind="group">
          <Form.Control>
            <Button color="link" type="submit">
              Save
            </Button>
          </Form.Control>
          <Form.Control>
            <Link href="/assembly">
              <a className="button">Cancel</a>
            </Link>
          </Form.Control>
        </Form.Field>
      </form>
    </Layout>
  );
}

// export default Home;
