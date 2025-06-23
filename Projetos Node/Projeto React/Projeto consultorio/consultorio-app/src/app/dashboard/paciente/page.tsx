'use client'
import React, { useEffect, useState } from 'react'
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa'
import api from '../../../lib/api'
import ModalConsulta from './components/ModalConsulta'
import { useRouter } from 'next/navigation'
import useAuthPaciente from '@/hooks/useAuthPaciente'
import PacienteNavbar from './components/PacienteNavbar'

interface Appointment {
  id: number
  date: string
  time: string
  doctor_name: string
  specialty: string
}

interface Specialty { id: number; name: string }
interface Doctor { id: number; name: string }
interface Schedule { weekday: number; start_time: string; end_time: string }

export default function DashboardPaciente() {

  useAuthPaciente()
  

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loadingList, setLoadingList] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null)
  const [doctorSchedule, setDoctorSchedule] = useState<Schedule[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userName, setUserName] = useState('Paciente')
  const router = useRouter()

  const loadData = async () => {
    setLoadingList(true)
    try {
      const [appointmentsRes, specialtiesRes] = await Promise.all([
        api.get('/appointments/clients'),
        api.get('/specialties')
      ])
      setAppointments(appointmentsRes.data)
      setSpecialties(specialtiesRes.data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    loadData()
    const name = localStorage.getItem('userName') || 'Paciente'
    setUserName(name)
  }, [])

  const handleSpecialtyChange = async (id: number) => {
    setSelectedSpecialty(id)
    setSelectedDoctor(null)
    setDoctorSchedule([])
    setSelectedDate('')
    const res = await api.get(`/specialties/${id}/medicos`)
    setDoctors(res.data)
  }

  const handleDoctorChange = async (id: number) => {
    setSelectedDoctor(id)
    setSelectedDate('')
    const res = await api.get(`/doctor/schedule/${id}`)
    setDoctorSchedule(res.data)
  }

  const closeModal = () => {
    setModalOpen(false)
    // reset filters so modal always starts fresh
    setSelectedSpecialty(null)
    setSelectedDoctor(null)
    setDoctorSchedule([])
    setSelectedDate('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1FAE5] via-white to-[#E0F7F5]">
      <PacienteNavbar />

      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Minhas Consultas</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            + Nova
          </button>
        </div>

        {loadingList ? (
          <p>Carregando...</p>
        ) : appointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.map(appt => (
              <div key={appt.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                <p className="text-sm text-gray-500">{appt.date} • {appt.time}</p>
                <h2 className="text-lg font-semibold mt-2">{appt.specialty}</h2>
                <p className="text-gray-600">Dr. {appt.doctor_name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Você não possui consultas agendadas.</p>
        )}
      </div>

      {modalOpen && (
        <ModalConsulta
          isOpen={modalOpen}
          onClose={() => { closeModal(); loadData() }}
          specialties={specialties}
          doctors={doctors}
          selectedSpecialtyId={selectedSpecialty ? String(selectedSpecialty) : ''}
          selectedDoctorId={selectedDoctor ? String(selectedDoctor) : ''}
          onSelectSpecialty={id => handleSpecialtyChange(Number(id))}
          onSelectDoctor={id => handleDoctorChange(Number(id))}
          doctorSchedule={doctorSchedule}
          onSelectDate={date => setSelectedDate(date)}
        />
      )}
    </div>
  )
}
