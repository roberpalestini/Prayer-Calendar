import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { prisma } from '../lib/prisma';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { signIn, useSession } from 'next-auth/react';
import {
  Heading,
  Box,
  Block,
  Image,
  Level,
  Button,
} from 'react-bulma-components';
import FullCalendar, { formatDate } from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import dayGridPlugin from '@fullcalendar/daygrid';
import { Calendar } from '@fullcalendar/core';
import { INITIAL_EVENTS, createEventId } from '../utils/event-utils'

interface FormData {
  name: string;
  country: string;
  id: string;
}

// Array interface
interface Assemblies {
  assemblies: {
    id: string;
    name: string;
    country: string;
  }[];
}

// Load assemblies from getServerSideProps server side rendering
export default function Home({ assemblies }) {
  const [form, setForm] = useState<FormData>({ name: '', country: '', id: '' });
  const [newAssembly, setNewAssembly] = useState<Boolean>(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentEvents, setCurrentEvents] = useState<any>([])
  if (status === 'loading') {
    return
  }

  if (status === 'unauthenticated') {
    return signIn();
  }

  const refreshData = () => {
    router.replace(router.asPath);
  };

  // useEffect(() => {
  //   if (status !== ('loading' || 'authenticated')) {
  //     if (!session) signIn()
  //   }
  // }), []

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
              'Content-Type': 'application/json',
            },
            method: 'POST',
          }).then(() => {
            setForm({ name: '', country: '', id: '' });
            refreshData();
          });
        } else {
          alert('Title can not be blank');
        }
      } else {
        // UPDATE
        fetch(`api/assembly/${data.id}`, {
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PUT',
        }).then(() => {
          setForm({ name: '', country: '', id: '' });
          setNewAssembly(true);
          refreshData();
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function updateAssembly(
    name,
    country,
    state,
    city,
    addressOne,
    addressTwo,
    schedule,
    id,
  ) {
    //console.log(name, country, id)
    setForm({ name, country, id });
    setNewAssembly(false);
  }

  async function deleteAssembly(id: string) {
    try {
      fetch(`api/assembly/${id}`, {
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
    setForm({ name: '', country: '', id: '' });
    setNewAssembly(true);
  }



  const handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible
    })
  }

  const handleDateSelect = (selectInfo) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }

  const handleEventClick = (clickInfo) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }

  const handleEvents = (events) => {
    setCurrentEvents({
      currentEvents: events
    })
  }



  return (
    <Layout>
      <Head>
        <title>Assemblies</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <br></br>
      <Box>
        <Block>
          <Heading>Pray for missionary!</Heading>
          <Heading subtitle>App</Heading>
        </Block>
      </Box>

      <hr></hr>
      <div className='demo-app'>
        {renderSidebar(currentEvents)}

        <div className='demo-app-main'>
          <FullCalendar
            plugins={[interactionPlugin, resourceTimelinePlugin, dayGridPlugin]}
            initialView='dayGridMonth'
            nowIndicator={true}
            editable={true}
            selectable={true}
            select={handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick}
            eventsSet={handleEvents} // called after events are initialized/added/changed/removed
            initialEvents={INITIAL_EVENTS}

            initialResources={[
              { id: 'a', title: 'Auditorium A' },
              { id: 'b', title: 'Auditorium B' },
              { id: 'c', title: 'Auditorium C' }
            ]}
            dateClick={function (info) {
              alert('Clicked on: ' + info.dateStr);
              alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
              alert('Current view: ' + info.view.type);
              // change the day's background color just for fun
              info.dayEl.style.backgroundColor = 'red';
            }}
          />
        </div>
      </div>
      <hr></hr>
      <Heading>Saved Assemblies</Heading>
      <Heading subtitle>App</Heading>
      <ul>
        {assemblies.map((assembly) => (
          <Box
            key={assembly.id}
            style={{ marginTop: '20px', marginBottom: '20px' }}
          >
            <li key={assembly.id} className="border-b border-gray-600 p-2">
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
                  {assembly.contacts ? (
                    <p className="text-sm">
                      <strong>Contacts: </strong>
                      {assembly.contacts}
                    </p>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div style={{ float: 'right', marginTop: '-30px' }}>
                <Button
                  color="link"
                  onClick={() =>
                    updateAssembly(
                      assembly.name,
                      assembly.country,
                      assembly.state,
                      assembly.city,
                      assembly.addressOne,
                      assembly.addressTwo,
                      assembly.schedule,
                      assembly.id,
                    )
                  }
                >
                  Edit
                </Button>
                <Button
                  color="error"
                  onClick={() => deleteAssembly(assembly.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          </Box>
        ))}
      </ul>

      {/* <h1 className="text-center font-bold text-2xl m-4">Assemblies</h1>
      <form className="w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch"
        onSubmit={e => {
          e.preventDefault()
          handleSubmit(form)
        }}>
        <input type="text"
          placeholder="Title"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border-2 rounded border-gray-600 p-1"
        />
        <textarea placeholder="Content"
          value={form.country}
          onChange={e => setForm({ ...form, country: e.target.value })}
          className="border-2 rounded border-gray-600 p-1"
        />
        {newAssembly ? (
          <button type="submit" className="bg-blue-500 text-white rounded p-1">Add +</button>
        ) : (
            <>
              <button type="submit" className="bg-blue-500 text-white rounded p-1">Update</button>
              <button onClick={handleCancel} className="bg-red-500 text-white rounded p-1">Cancel</button>
            </>
          )}
      </form>
*/}
    </Layout>
  );
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
      <i>{event.title}</i>
    </li>
  )
}

function renderSidebar(events?: any) {
  return (
    <div className='demo-app-sidebar'>
      <div className='demo-app-sidebar-section'>
        <h2>Instructions</h2>
        <ul>
          <li>Select dates and you will be prompted to create a new event</li>
          <li>Drag, drop, and resize events</li>
          <li>Click an event to delete it</li>
        </ul>
      </div>
      <div className='demo-app-sidebar-section'>

      </div>
      <div className='demo-app-sidebar-section'>
        <h2>All Events</h2>
        <ul>
          {renderSidebarEvent(INITIAL_EVENTS)}
        </ul>
      </div>
    </div>
  )
}

// export default Home;

// Server side rendering on every request
export const getServerSideProps: GetServerSideProps = async () => {
  // READ all assemblies from DB
  const assemblies = await prisma?.assembly.findMany({
    select: {
      name: true,
      id: true,
      country: true,
    },
  });

  return {
    props: {
      assemblies,
    },
  };
};
