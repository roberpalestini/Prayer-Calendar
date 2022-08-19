import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { prisma } from '../../lib/prisma'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Layout from "../../components/Layout"
import { Form, Button, Heading } from 'react-bulma-components';
interface FormData {
  name: string
  website: string
  email: string
  emailTwo: string
  phone: string
  cellPhone: string
  details: string
  country: string
  state: string
  city: string
  addressOne: string
  addressTwo: string
  schedule: string
  id: string
}

// Array interface
interface Ministries {
  ministries: {
    id: string
    name: string
    website: string
    email: string
    emailTwo: string
    phone: string
    cellPhone: string
    details: string
    country: string
    state: string
    city: string
    addressOne: string
    addressTwo: string
    schedule: string
  }[]
}


// Load ministries from getServerSideProps server side rendering
const Home: NextPage<Ministries> = ({ ministries }) => {
  const blank = {name: '', website: '',  email: '', emailTwo: '', phone: '', cellPhone: '', details: '', country: '',  state: '',  city: '',  addressOne: '',  addressTwo: '',  schedule: '',  id: ''}
  const [form, setForm] = useState<FormData>(blank)
  const [newMinistry, setNewMinistry] = useState<Boolean>(true)
  const router = useRouter()

  const refreshData = () => {
    router.replace(router.asPath)
  }

  async function handleSubmit(data: FormData) {
    // console.log(data)
    // console.log(newMinistry)

    try {
      if (newMinistry) {
        // Check input is not blank
        if (data.name) {
          // CREATE
          fetch('api/ministry/create', {
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'POST'
          }).then(() => {
            setForm(blank)
            refreshData()
          })
        }
        else {
          alert("Title can not be blank")
        }
      }
      else {
        // UPDATE
          fetch(`api/ministry/${data.id}`, {
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'PUT'
          }).then(() => {
            setForm(blank)
            setNewMinistry(true)
            refreshData()
          })
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function updateMinistry(name, website, email, emailTwo, details, phone, cellPhone, country, state, city, addressOne, addressTwo, id) {
    //console.log(name, country, id)
    setForm({name, website, email, emailTwo, details, phone, cellPhone, country, state, city, addressOne, addressTwo, id})
    setNewMinistry(false)
  }

  async function deleteMinistry(id: string) {
    try {
      fetch(`api/ministry/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE'
      }).then(() => {
        refreshData()
      })
    } catch (error) {
      console.log(error)
    }
  }

  function handleCancel() {
    setForm(blank)
    setNewMinistry(true)
  }

  return (
    <Layout>
      <Head>
        <title>Ministries</title>
      </Head>
      <Heading size="1">Ministries</Heading>
      <form onSubmit={e => {
          e.preventDefault()
          handleSubmit(form)
      }}>
      <Form.Field>
        <Form.Label>Name</Form.Label>
        <Form.Input type="text" 
          placeholder="Help Center"
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})}
        />
      </Form.Field>
      <Form.Field>
        <Form.Label>Details</Form.Label>
        <Form.Textarea type="text" 
          placeholder=""
          value={form.details} 
          onChange={e => setForm({...form, details: e.target.value})}
        />
      </Form.Field>
      <Form.Field>
        <Form.Label>Email</Form.Label>
        <Form.Input type="text" 
          placeholder="e@e.e"
          value={form.email} 
          onChange={e => setForm({...form, email: e.target.value})}
        />
      </Form.Field>
      <Form.Field>
        <Form.Label>Secondary Email</Form.Label>
        <Form.Input type="text" 
          placeholder="e@e.e"
          value={form.emailTwo} 
          onChange={e => setForm({...form, emailTwo: e.target.value})}
        />
      </Form.Field>
      <Form.Field>
        <Form.Label>Phone</Form.Label>
        <Form.Input type="text" 
          placeholder="(000) 000-0000"
          value={form.phone} 
          onChange={e => setForm({...form, phone: e.target.value})}
        />
      </Form.Field>
      <Form.Field>
           <Form.Label>Cell Phone</Form.Label>
        <Form.Input type="text" 
          placeholder="(000) 000-0000" 
          value={form.cellPhone} 
          onChange={e => setForm({...form, cellPhone: e.target.value})}
        />
      </Form.Field>
      <Form.Field>
        <Form.Label>Country</Form.Label>
        <Form.Input type="text" 
          placeholder="USA" 
          value={form.country} 
          onChange={e => setForm({...form, country: e.target.value})}
        />
      </Form.Field>
      <Form.Field>
        <Form.Label>State/Provice</Form.Label>
        <Form.Input type="text" 
          placeholder="Illinois" 
          value={form.state} 
          onChange={e => setForm({...form, state: e.target.value})}
        />
      </Form.Field>
      <Form.Field>
        <Form.Label>City</Form.Label>
        <Form.Input type="text" 
          placeholder="Chicago" 
          value={form.city} 
          onChange={e => setForm({...form, city: e.target.value})}
        />
      </Form.Field>
      <Form.Field>
        <Form.Label>Address Line One</Form.Label>
        <Form.Input type="text" 
          placeholder="One Drive" 
          value={form.addressOne} 
          onChange={e => setForm({...form, addressOne: e.target.value})}
        />
      </Form.Field>
      <Form.Field>
        <Form.Label>Address Line Two</Form.Label>
        <Form.Input type="text" 
          placeholder="PO Box 1" 
          value={form.addressTwo} 
          onChange={e => setForm({...form, addressTwo: e.target.value})}
        />
      </Form.Field>

        <Form.Field kind="group">
        <Form.Control>
        {newMinistry ? (
          <Button color="link" type="submit">Add +</Button>
        ) : (
          <>
            <Button color="link" type="submit" className="mr-3" >Update</Button>
            <Button color="link" colorVariant="light" onClick={handleCancel}>Cancel</Button>
          </>
        )}
        </Form.Control>
        </Form.Field>
      </form>

      <div className="w-auto min-w-[25%] max-w-min mt-10 mx-auto space-y-6 flex flex-col items-stretch">
        <h2 className="text-center font-bold text-xl mt-4">Saved Ministries</h2>
        <ul>
          {ministries.map(ministry => (
            <li key={ministry.id} className="border-b border-gray-600 p-2">
              <div className="flex jusify-between">
                <div className="flex-1">
                  <h3 className="font-bold">{ministry.name}</h3>
                  <p className="text-sm">{ministry.website}</p>
                  <p className="text-sm">{ministry.details}</p>
                  <p className="text-sm">{ministry.email}</p>
                  <p className="text-sm">{ministry.emailTwo}</p>
                  <p className="text-sm">{ministry.phone}</p>
                  <p className="text-sm">{ministry.cellPhone}</p>
                  <p className="text-sm">{ministry.country}</p>
                  <p className="text-sm">{ministry.state}</p>
                  <p className="text-sm">{ministry.city}</p>
                  <p className="text-sm">{ministry.addressOne}</p>
                  <p className="text-sm">{ministry.addressTwo}</p>
                </div>
                <button onClick={() => updateMinistry(ministry.name, ministry.website, ministry.email, ministry.emailTwo, ministry.details, ministry.phone, ministry.cellPhone, ministry.country, ministry.state, ministry.city, ministry.addressOne, ministry.addressTwo, ministry.id)}>Edit</button>
                <button onClick={() => deleteMinistry(ministry.id)} >Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}

export default Home

// Server side rendering on every request
export const getServerSideProps: GetServerSideProps = async () => {
  // READ all ministries from DB
  const ministries = await prisma?.ministry.findMany({
    select: {
      id: true,
      name: true,
      website: true,
      email: true,
      emailTwo: true,
      phone: true,
      cellPhone: true,
      details: true,
      country: true,
      state: true,
      city: true,
      addressOne: true,
      addressTwo: true,
    }
  })

  return {
    props: {
      ministries
    }
  }
}