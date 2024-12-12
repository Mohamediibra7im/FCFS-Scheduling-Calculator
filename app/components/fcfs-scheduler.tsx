"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Process {
  id: number
  arrivalTime: number
  burstTime: number
  completionTime: number
  turnaroundTime: number
  waitingTime: number
}

export default function FCFSScheduler() {
  const [processes, setProcesses] = useState<Process[]>([])
  const [arrivalTime, setArrivalTime] = useState('')
  const [burstTime, setBurstTime] = useState('')
  const [results, setResults] = useState<{ avgWaitingTime: number; avgTurnaroundTime: number } | null>(null)

  const addProcess = () => {
    if (arrivalTime && burstTime) {
      setProcesses([
        ...processes,
        {
          id: processes.length + 1,
          arrivalTime: parseInt(arrivalTime),
          burstTime: parseInt(burstTime),
          completionTime: 0,
          turnaroundTime: 0,
          waitingTime: 0,
        },
      ])
      setArrivalTime('')
      setBurstTime('')
    }
  }

  const calculateFCFS = () => {
    if (processes.length === 0) return

    let sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)
    let currentTime = 0
    let totalWaitingTime = 0
    let totalTurnaroundTime = 0

    sortedProcesses = sortedProcesses.map(process => {
      if (currentTime < process.arrivalTime) {
        currentTime = process.arrivalTime
      }

      const waitingTime = currentTime - process.arrivalTime
      currentTime += process.burstTime
      const turnaroundTime = currentTime - process.arrivalTime

      totalWaitingTime += waitingTime
      totalTurnaroundTime += turnaroundTime

      return {
        ...process,
        completionTime: currentTime,
        turnaroundTime,
        waitingTime,
      }
    })

    setProcesses(sortedProcesses)
    setResults({
      avgWaitingTime: totalWaitingTime / processes.length,
      avgTurnaroundTime: totalTurnaroundTime / processes.length,
    })
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">FCFS Scheduling Calculator</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          type="number"
          placeholder="Arrival Time"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
          className="w-full"
        />
        <Input
          type="number"
          placeholder="Burst Time"
          value={burstTime}
          onChange={(e) => setBurstTime(e.target.value)}
          className="w-full"
        />
        <Button onClick={addProcess} className="w-full sm:w-auto">Add Process</Button>
      </div>
      <Button onClick={calculateFCFS} className="mb-4 w-full sm:w-auto">Calculate FCFS</Button>
      {processes.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Process ID</TableHead>
                <TableHead>Arrival Time</TableHead>
                <TableHead>Burst Time</TableHead>
                <TableHead>Completion Time</TableHead>
                <TableHead>Turnaround Time</TableHead>
                <TableHead>Waiting Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.map((process) => (
                <TableRow key={process.id}>
                  <TableCell>{process.id}</TableCell>
                  <TableCell>{process.arrivalTime}</TableCell>
                  <TableCell>{process.burstTime}</TableCell>
                  <TableCell>{process.completionTime}</TableCell>
                  <TableCell>{process.turnaroundTime}</TableCell>
                  <TableCell>{process.waitingTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {results && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Results</h2>
          <p>Average Waiting Time: {results.avgWaitingTime.toFixed(2)}</p>
          <p>Average Turnaround Time: {results.avgTurnaroundTime.toFixed(2)}</p>
        </div>
      )}
    </div>
  )
}

