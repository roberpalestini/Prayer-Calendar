import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { prisma } from '../../lib/prisma';
import { GetServerSideProps } from 'next';
import { useSession, getSession, signIn } from 'next-auth/react';

import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { Form, Button, Heading, Box } from 'react-bulma-components';
interface FormData {
  name: string;
  note: string;
  email: string;
  homePhone: string;
  cellPhone: string;
  country: string;
  state: string;
  city: string;
  addressOne: string;
  addressTwo: string;
  schedule: string;
  id: string;
}

// Array interface
interface People {
  people: {
    id: string;
    name: string;
    note: string;
    email: string;
    homePhone: string;
    cellPhone: string;
    country: string;
    state: string;
    city: string;
    addressOne: string;
    addressTwo: string;
    schedule: string;
  }[];
}

// Load people from getServerSideProps server side rendering
const Home: NextPage<People> = ({ people }) => {
  const blank = {
    name: '',
    email: '',
    note: '',
    homePhone: '',
    cellPhone: '',
    country: '',
    state: '',
    city: '',
    addressOne: '',
    addressTwo: '',
    schedule: '',
    id: '',
  };
  const [form, setForm] = useState<FormData>(blank);
  const [newPerson, setNewPerson] = useState<Boolean>(true);
  const router = useRouter();

  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <></>;
  }

  if (status === 'unauthenticated') {
    return signIn();
  }

  const refreshData = () => {
    router.replace(router.asPath);
  };

  async function handleSubmit(data: FormData) {
    // console.log(data)
    // console.log(newPerson)

    try {
      if (newPerson) {
        // Check input is not blank
        if (data.name) {
          // CREATE
          fetch('api/person/create', {
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          }).then(() => {
            setForm(blank);
            refreshData();
          });
        } else {
          alert('Title can not be blank');
        }
      } else {
        // UPDATE
        fetch(`api/person/${data.id}`, {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PUT',
        }).then(() => {
          setForm(blank);
          setNewPerson(true);
          refreshData();
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function updatePerson(
    name,
    note,
    email,
    homePhone,
    cellPhone,
    country,
    state,
    city,
    addressOne,
    addressTwo,
    id,
  ) {
    setForm({
      name,
      note,
      email,
      homePhone,
      cellPhone,
      country,
      state,
      city,
      addressOne,
      addressTwo,
      id,
    });
    setNewPerson(false);
  }

  async function deletePerson(id: string) {
    try {
      fetch(`api/person/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      }).then(() => {
        refreshData();
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleCancel() {
    setForm(blank);
    setNewPerson(true);
  }

  return (
    <Layout>
      <Head>
        <title>Contacts</title>
      </Head>
      <Heading size="1">Contacts</Heading>
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
            placeholder="Mr Smith"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Form.Field>
        <Form.Field>
          <Form.Label>Notes</Form.Label>
          <Form.Textarea
            type="text"
            placeholder=""
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </Form.Field>
        <Form.Field>
          <Form.Label>Eamil</Form.Label>
          <Form.Input
            type="text"
            placeholder="e@e.e"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Form.Field>
        <Form.Field>
          <Form.Label>Home Phone</Form.Label>
          <Form.Input
            type="text"
            placeholder="(000) 000-0000"
            value={form.homePhone}
            onChange={(e) => setForm({ ...form, homePhone: e.target.value })}
          />
        </Form.Field>
        <Form.Field>
          <Form.Label>Cell Phone</Form.Label>
          <Form.Input
            type="text"
            placeholder="(000) 000-0000"
            value={form.cellPhone}
            onChange={(e) => setForm({ ...form, cellPhone: e.target.value })}
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

        <Form.Field kind="group">
          <Form.Control>
            {newPerson ? (
              <Button color="link" type="submit">
                Add +
              </Button>
            ) : (
              <>
                <Button color="link" type="submit" className="mr-3">
                  Update
                </Button>
                <Button
                  color="link"
                  colorVariant="light"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </>
            )}
          </Form.Control>
        </Form.Field>
      </form>

      <div className="w-auto min-w-[25%] max-w-min mt-10 mx-auto space-y-6 flex flex-col items-stretch">
        <h2 className="text-center font-bold text-xl mt-4">Saved Contacts</h2>
        <ul>
          {people.map((person) => (
            <Box key={person.id}>
              <li className="border-b border-gray-600 p-2">
                <div className="flex jusify-between">
                  <div className="flex-1">
                    <h3 className="font-bold">
                      <strong>Name: </strong>
                      {person.name}
                    </h3>
                    <p className="text-sm">
                      <strong>Note: </strong>
                      {person.note}
                    </p>
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
                      <strong>Address One: </strong>
                      {person.addressOne}
                    </p>
                    <p className="text-sm">
                      <strong>Address Two: </strong>
                      {person.addressTwo}
                    </p>
                  </div>
                  <div style={{ float: 'right', marginTop: '-30px' }}>
                    <Button
                      color="link"
                      onClick={() =>
                        updatePerson(
                          person.name,
                          person.note,
                          person.email,
                          person.homePhone,
                          person.cellPhone,
                          person.country,
                          person.state,
                          person.city,
                          person.addressOne,
                          person.addressTwo,
                          person.id,
                        )
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      color="error"
                      onClick={() => deletePerson(person.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            </Box>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Home;

// Server side rendering on every request
export const getServerSideProps: GetServerSideProps = async () => {
  // READ all people from DB
  const people = await prisma?.person.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      note: true,
      homePhone: true,
      cellPhone: true,
      country: true,
      state: true,
      city: true,
      addressOne: true,
      addressTwo: true,
    },
  });

  return {
    props: {
      people,
    },
  };
};
