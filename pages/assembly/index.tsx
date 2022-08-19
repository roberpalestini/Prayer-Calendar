import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { useSession } from "next-auth/react"
import { prisma } from '../../lib/prisma'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Layout from "../../components/Layout"
import AccessDenied from "../../components/access-denied"
import { Form, Button, Heading } from 'react-bulma-components';
interface FormData {
  name: string
  country: string
  state: string
  city: string
  addressOne: string
  addressTwo: string
  schedule: string
  id: string
}

// Array interface
interface Assemblies {
  assemblies: {
    id: string
    name: string
    country: string
    state: string
    city: string
    addressOne: string
    addressTwo: string
    schedule: string
  }[]
}


// Load assemblies from getServerSideProps server side rendering
const Home: NextPage<Assemblies> = ({ assemblies }) => {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  // When rendering client side don't display anything until loading is complete
  if (typeof window !== "undefined" && loading) return null

  if (!session) {
    return (
      <>
        <AccessDenied />
      </>
    )
  }

  const blank = {name: '',  country: '',  state: '',  city: '',  addressOne: '',  addressTwo: '',  schedule: '',  id: ''}
  const [form, setForm] = useState<FormData>(blank)
  const [newAssembly, setNewAssembly] = useState<Boolean>(true)
  const router = useRouter()

  const refreshData = () => {
    router.replace(router.asPath)
  }

  async function handleSubmit(data: FormData) {
    // console.log(data)
    // console.log(newAssembly)

    try {
      if (newAssembly) {
        // Check input is not blank
        if (data.name) {
          // CREATE
          fetch('api/assembly/create', {
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
          fetch(`api/assembly/${data.id}`, {
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'PUT'
          }).then(() => {
            setForm(blank)
            setNewAssembly(true)
            refreshData()
          })
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function updateAssembly(name, country, id) {
    //console.log(name, country, id)
    setForm({name, country, id})
    setNewAssembly(false)
  }

  async function deleteAssembly(id: string) {
    try {
      fetch(`api/assembly/${id}`, {
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
    setNewAssembly(true)
  }

  return (
    <Layout>
      <Head>
        <title>Assemblies</title>
      </Head>
      <Heading size="1">Assemblies</Heading>
      <form onSubmit={e => {
          e.preventDefault()
          handleSubmit(form)
      }}>
      <Form.Field>
        <Form.Label>Name</Form.Label>
        <Form.Input type="text" 
          placeholder="Christian Assembly"
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})}
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

        <Form.Field>
        <Form.Label>Schedule</Form.Label>
        <Form.Textarea placeholder="Content" 
          value={form.schedule} 
          onChange={e => setForm({...form, schedule: e.target.value})} 
        ></Form.Textarea>
        </Form.Field>
        <Form.Field kind="group">
        <Form.Control>
        {newAssembly ? (
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
        <h2 className="text-center font-bold text-xl mt-4">Saved Assemblies</h2>
        <ul>
          {assemblies.map(assembly => (
            <li key={assembly.id} className="border-b border-gray-600 p-2">
              <div className="flex jusify-between">
                <div className="flex-1">
                  <h3 className="font-bold">{assembly.name}</h3>
                  <p className="text-sm">{assembly.country}</p>
                  <p className="text-sm">{assembly.state}</p>
                  <p className="text-sm">{assembly.city}</p>
                  <p className="text-sm">{assembly.addressOne}</p>
                  <p className="text-sm">{assembly.addressOne}</p>
                  <p className="text-sm">{assembly.schedule}</p>
                </div>
                <button onClick={() => updateAssembly(assembly.name, assembly.country, assembly.state, assembly.city, assembly.addressOne, assembly.addressTwo, assembly.schedule, assembly.id)} >Edit</button>
                <button onClick={() => deleteAssembly(assembly.id)} >Delete</button>
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
  // READ all assemblies from DB
  const assemblies = await prisma?.assembly.findMany({
    select: {
      id: true,
      name: true,
      country: true,
      state: true,
      city: true,
      addressOne: true,
      addressTwo: true,
      schedule: true,
    }
  })

  return {
    props: {
      assemblies
    }
  }
}