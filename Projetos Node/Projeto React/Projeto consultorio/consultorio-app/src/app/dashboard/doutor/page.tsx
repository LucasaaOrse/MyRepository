// app/dashboard/doctor/page.tsx
'use client'
import React, { useEffect, useState, useMemo } from 'react'
import Footer from '@/app/components/Footer'
import api from '@/lib/api'
import useAuthDoctor from '@/hooks/useAuthDoctor'
import { format } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import DoctorNavbar from './components/DoctorNavbar'

import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'

interface Appointment {
  id: number
  date: string        // 'YYYY-MM-DD'
  time: string        // 'HH:mm'
  client_name: string
  specialty: string
}

interface Schedule {
  weekday: number
  start_time: string
  end_time: string
}

export default function DashboardDoctor() {
  useAuthDoctor()

  const [appointments, setAppointments] = useState<Appointment[]>([])
  // vamos pré‑selecionar hoje para já mostrar algo
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [doctorSchedule, setDoctorSchedule] = useState<Schedule[]>([])

  // carrega agenda do doutor
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const meRes = await api.get('/me')
        const doctorId = meRes.data.user.id
        const scheduleRes = await api.get<Schedule[]>(`/doctor/schedule/${doctorId}`)
        setDoctorSchedule(scheduleRes.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchSchedule()
  }, [])

  // carrega consultas do doutor
  useEffect(() => {
    api.get<{ appointmentList: Appointment[] }>('/appointments/doctors')
      .then(r => setAppointments(r.data.appointmentList))
      .catch(console.error)
  }, [])

  // agrupa por data
  const byDate = useMemo(() => {
    return appointments.reduce<Record<string, Appointment[]>>((acc, a) => {
      acc[a.date] = acc[a.date]||[]
      acc[a.date].push(a)
      return acc
    }, {})
  }, [appointments])

  // extrai o expediente do dia selecionado
  const workingHours = useMemo(() => {
    const wd = selectedDate.getDay()
    return doctorSchedule.find(s => s.weekday === wd) || null
  }, [selectedDate, doctorSchedule])

  // eventos para o FullCalendar
  const eventsForDay = useMemo(() => {
    const key = format(selectedDate,'yyyy-MM-dd')
    return (byDate[key]||[]).map(a => ({
      id: String(a.id),
      title: `${a.client_name} (${a.specialty})`,
      start: `${a.date}T${a.time}`,
    }))
  }, [selectedDate, byDate])

  return (
    <main className="bg-gray-50 min-h-screen flex flex-col">
      <DoctorNavbar/>

      <section className="bg-blue-100 py-12 px-4 text-center">
        <h1 className="text-4xl font-bold text-blue-800">Agenda do Doutor</h1>
        <p className="mt-2 text-lg text-blue-900">Visualize e gerencie suas consultas</p>
      </section>

      <div className="flex-1 p-8 max-w-6xl mx-auto">
        <div className="md:flex gap-8">
          {/* calendário de seleção */}
          <div className="bg-white p-4 rounded-xl shadow-md">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={d => d && setSelectedDate(d)}
              fromDate={new Date()}
              modifiers={{
                hasAppt: date => (byDate[format(date,'yyyy-MM-dd')]?.length ?? 0) > 0
              }}
              modifiersClassNames={{ hasAppt:'bg-blue-200' }}
              className="border border-blue-200"
            />
          </div>

          {/* agenda hora a hora */}
          <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
            {workingHours ? (
              <FullCalendar
                key={selectedDate.toISOString()}           // força re‑render ao trocar data
                plugins={[timeGridPlugin]}
                initialView="timeGridDay"
                headerToolbar={false}
                initialDate={selectedDate}
                events={eventsForDay}
                height="auto"
                allDaySlot={false}
                slotMinTime={workingHours.start_time}
                slotMaxTime={workingHours.end_time}
                slotDuration="00:30:00"
                nowIndicator
              />
            ) : (
              <p className="text-gray-500">Selecione um dia com expediente para ver a agenda.</p>
            )}
          </div>
        </div>
      </div>

      <Footer/>
    </main>
  )
}
