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
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import dayGridPlugin from '@fullcalendar/daygrid';
import { Calendar } from '@fullcalendar/core';
import { INITIAL_EVENTS, createEventId } from '../utils/event-utils'
import { req } from 'superagent'; // ajax library

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

interface requestModel {
  requestModel: {
    id: string;
    content: string;
    publishedAt: Date;
  }[];
}

interface calendarModel {
  id: number
  tittle: string
  start: Date
}

// Load assemblies from getServerSideProps server side rendering
export default function Home(requestModel: requestModel) {
  const [form, setForm] = useState<FormData>({ name: '', country: '', id: '' });
  const [newAssembly, setNewAssembly] = useState<Boolean>(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentEvents, setCurrentEvents] = useState<any>()
  const [dataForCalendar, setDataForCalendar] = useState<calendarModel[]>()


 


  if (status === 'loading') {
    return
  }

  if (status === 'unauthenticated') {
    return signIn();
  }

  const refreshData = () => {
    router.replace(router.asPath);
  };



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

  const handleEventCreator = (selectInfo) => {
    let title = requestModel.requestModel[0].content
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: requestModel.requestModel[0].publishedAt,

      })
    }
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
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove()
    // }
  }

 


  return (
    <Layout>
      <Head>
        <title>Assemblies</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <br></br>
      {/* <Box>
        <Block>
          <Heading>Pray for missionary!</Heading>
          <Heading subtitle>App</Heading>
        </Block>
        <Button
          color="link"
          onClick={() => console.log(requestModel)
          }
        >
          Edit
        </Button>
      </Box> */}

      <hr></hr>
      <div className='demo-app'>
        <div className='demo-app-sidebar'>
          <div className='demo-app-sidebar-section'>
            <h2>All Events</h2>

            <Heading>Saved Assemblies</Heading>
            <Heading subtitle>App</Heading>
          
<div
              id="external-events"
              style={{
                padding: "10px",
                width: "80%",
                height: "auto",
                maxHeight: "-webkit-fill-available"
              }}
            >
              <p>
                <button onClick={() => console.log(requestModel)}><strong> Events</strong></button>
              </p>
              {requestModel.requestModel !== undefined ? (requestModel.requestModel.map(event => (
                <div
                  className="fc-event"
                  title={event.content}
                  key={event.id}
                >
                  <p>
                    {event.content}  
                  </p>
                  <p>
                    {JSON.stringify(event.publishedAt)}
                  </p>
                </div>
              ))) : ''}
              
            </div>
          </div>
        </div>

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
           
            eventDataTransform= {function (requestModel){
              var ro: any = new Object();
              ro.start = requestModel.publishedAt;
              ro.end = requestModel.publishedAt;
              ro.title = requestModel.content;
              ro.sourceObject = requestModel;
              
              console.log("converted event", ro);
              return ro;
            }
          }
          events={requestModel.requestModel}
          
          // resources={requestModel.request}
          // dateClick={function (info) {
          //   alert('Clicked on: ' + info.dateStr);
          //   alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
          //   alert('Current view: ' + info.view.type);
          //   // change the day's background color just for fun
          //   info.dayEl.style.backgroundColor = 'red';
          // }}
          />
        </div>
      </div>
      <hr></hr>

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



// export default Home;

// Server side rendering on every request
// READ all assemblies from DB
// const assemblies = await prisma?.assembly.findMany({
//   select: {
//     name: true,
//     id: true,
//     country: true,
//   },
// });

export const getServerSideProps: GetServerSideProps = async () => {
  const requestModel = await prisma?.request.findMany({
    select: {
      id: true,
      content: true,
      publishedAt: true,
      personId: true,
      assemblyId: true,
      ministryId: true,
      createdAt: true,
      updatedAt: true,
      assembly: true,
    },
  }
  )

  return {
    props: {
      requestModel: JSON.parse(JSON.stringify(requestModel))
    },
  };
};
