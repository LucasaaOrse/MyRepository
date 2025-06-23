'use client'

import React, { useEffect, useState } from 'react'
import { format, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import toast from 'react-hot-toast'
import api from '@/lib/api'

interface Specialty { id: number; name: string }
interface Doctor { id: number; name: string }
interface Schedule { weekday: number; start_time: string; end_time: string }

interface Props {
  isOpen: boolean
  onClose: () => void
  specialties: Specialty[]
  doctors: Doctor[]
  selectedSpecialtyId: string
  selectedDoctorId: string
  onSelectSpecialty: (id: string) => void
  onSelectDoctor: (id: string) => void
  doctorSchedule: Schedule[]
  onSelectDate: (date: string) => void
}

function getAvailableHours(start: string, end: string): string[] {
  const startHour = parseInt(start.split(':')[0], 10)
  const endHour = parseInt(end.split(':')[0], 10)
  const hours: string[] = []
  for (let h = startHour; h < endHour; h++) {
    hours.push(`${h.toString().padStart(2, '0')}:00`)
  }
  return hours
}

function getNextNDatesWithWeekdays(weekdays: number[], n = 30): Date[] {
  const today = new Date()
  const dates: Date[] = []
  let i = 0
  while (dates.length < n && i < 60) {
    const d = new Date()
    d.setDate(today.getDate() + i)
    if (weekdays.includes(d.getDay())) dates.push(d)
    i++
  }
  return dates
}

type OccupiedSlot = { date: string; time: string }
type OccupiedSlotsResponse = { occupiedSlots: OccupiedSlot[] }

export default function ModalConsulta({
  isOpen, onClose,
  specialties, doctors,
  selectedSpecialtyId, selectedDoctorId,
  onSelectSpecialty, onSelectDoctor,
  doctorSchedule, onSelectDate
}: Props) {
  const [selectedDay, setSelectedDay] = useState<Date>()
  const [availableHours, setAvailableHours] = useState<string[]>([])
  const [selectedHour, setSelectedHour] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [fullyBookedDates, setFullyBookedDates] = useState<Date[]>([])
  const [occupiedHours, setOccupiedHours] = useState<string[]>([])

  const enabledWeekdays = doctorSchedule.map(s => s.weekday)
  const enabledDates = getNextNDatesWithWeekdays(enabledWeekdays)

  // reset internal state whenever modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDay(undefined)
      setAvailableHours([])
      setSelectedHour(null)
      setOccupiedHours([])
    }
  }, [isOpen])

  // load fully booked dates
  useEffect(() => {
    if (!selectedDoctorId) {
      setFullyBookedDates([])
      return
    }
    ;(async () => {
      try {
        const res = await api.get<{ appointmentList: { date: string; time: string }[] }>(
          `/appointments/doctor/${selectedDoctorId}`
        )
        const byDate = res.data.appointmentList.reduce<Record<string, string[]>>((acc, a) => {
          (acc[a.date] = acc[a.date] || []).push(a.time)
          return acc
        }, {})
        const fullDates: Date[] = []
        for (const [date, times] of Object.entries(byDate)) {
          const d = new Date(date)
          const schedule = doctorSchedule.find(s => s.weekday === d.getDay())
          if (schedule) {
            const all = getAvailableHours(schedule.start_time, schedule.end_time)
            if (times.length >= all.length) fullDates.push(d)
          }
        }
        setFullyBookedDates(fullDates)
      } catch (err) {
        console.error('Erro ao buscar dias totalmente ocupados:', err)
      }
    })()
  }, [selectedDoctorId, doctorSchedule])

  // load occupied hours when a day is selected
  useEffect(() => {
    if (!selectedDay || !selectedDoctorId) {
      setAvailableHours([])
      setOccupiedHours([])
      return
    }
    const schedule = doctorSchedule.find(s => s.weekday === selectedDay.getDay())
    if (!schedule) {
      setAvailableHours([])
      setOccupiedHours([])
      return
    }
    const all = getAvailableHours(schedule.start_time, schedule.end_time)
    setAvailableHours(all)

    ;(async () => {
      try {
        const dateString = format(selectedDay, 'yyyy-MM-dd')
        const res = await api.get<OccupiedSlotsResponse>(
          `/appointments/occupied-slots/doctor/${selectedDoctorId}?date=${dateString}`
        )
        setOccupiedHours(res.data.occupiedSlots.map(o => o.time))
      } catch (err) {
        console.error('Erro ao buscar horários ocupados:', err)
        setOccupiedHours([])
      }
    })()
  }, [selectedDay, selectedDoctorId, doctorSchedule])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-auto p-6 rounded-xl shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-600 hover:text-black"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6">Marcar Consulta</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Especialidade</label>
            <select
              className="w-full border p-2 rounded"
              value={selectedSpecialtyId}
              onChange={e => onSelectSpecialty(e.target.value)}
            >
              <option value="">Selecione...</option>
              {specialties.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Doutor</label>
            <select
              className="w-full border p-2 rounded"
              value={selectedDoctorId}
              onChange={e => onSelectDoctor(e.target.value)}
            >
              <option value="">Selecione...</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {selectedDoctorId && (
            <div className="lg:col-span-2">
              <label className="block mb-2 text-sm font-medium">Selecione uma data</label>
              <DayPicker
                mode="single"
                selected={selectedDay}
                onSelect={setSelectedDay}
                locale={ptBR}
                fromDate={new Date()}
                className="border rounded"
                modifiersClassNames={{
                  selected: 'bg-green-500 text-white',
                  disabled: 'text-gray-400 line-through'
                }}
                disabled={date =>
                  !enabledDates.some(d => isSameDay(d, date)) ||
                  fullyBookedDates.some(d => isSameDay(d, date))
                }
              />
            </div>
          )}
        </div>

        {selectedDay && (
          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium">Horários disponíveis</label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {availableHours.length > 0 ? availableHours.map(hour => {
                const isOcc = occupiedHours.includes(hour)
                return (
                  <button
                    key={hour}
                    onClick={() => !isOcc && setSelectedHour(hour)}
                    disabled={isOcc}
                    className={`p-2 border rounded text-sm transition-all ${
                      selectedHour === hour ? 'bg-blue-600 text-white' : 'bg-blue-100 hover:bg-blue-200'
                    } ${isOcc ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}`}
                  >
                    {hour} {isOcc && <span className="text-red-500 text-xs">(Indisponível)</span>}
                  </button>
                )
              }) : (
                <p className="text-sm text-gray-500">Nenhum horário disponível neste dia.</p>
              )}
            </div>

            <div className="mt-4 text-right">
              <button
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedHour || loading}
                onClick={async () => {
                  if (!selectedDay || !selectedHour || !selectedDoctorId) return
                  const date = format(selectedDay, 'yyyy-MM-dd')
                  setLoading(true)
                  try {
                    await api.post('/appointments', {
                      doctor_id: Number(selectedDoctorId),
                      date,
                      time: selectedHour
                    })
                    toast.success('Consulta agendada!')
                    onSelectDate(`${date} ${selectedHour}`)
                    onClose()
                  } catch {
                    toast.error('Falha ao agendar.')
                  } finally {
                    setLoading(false)
                  }
                }}
              >
                {loading ? 'Aguarde...' : 'Confirmar Consulta'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
