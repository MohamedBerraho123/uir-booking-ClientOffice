import { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, Search, MoreHorizontal } from 'lucide-react'

import { Button } from "../components/ui/button"
import { Calendar } from "../components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Input } from "../components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { ScrollArea } from "../components/ui/scroll-area"

export default function Reservation() {
  const [date, setDate] = useState(null)
  const [selectedSport, setSelectedSport] = useState("all")

  const reservations = [
    {
      studentCode: "UIR5547",
      fullName: "Souhail Alaoui",
      sport: "Football",
      time: "01:00:00 - 02:00:00",
      date: "2024-11-16",
      listStudent: "UIR56477",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "Confirmed"
    },
    {
      studentCode: "UIR5548",
      fullName: "Amina Benali",
      sport: "Padel",
      time: "02:00:00 - 03:00:00",
      date: "2024-11-16",
      listStudent: "UIR56478",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "Pending"
    },
    {
      studentCode: "UIR5549",
      fullName: "Youssef El Amrani",
      sport: "Tennis",
      time: "03:00:00 - 04:00:00",
      date: "2024-11-16",
      listStudent: "UIR56479",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "Confirmed"
    },
    {
      studentCode: "UIR5550",
      fullName: "Fatima Zahra Ouazzani",
      sport: "Volleyball",
      time: "04:00:00 - 05:00:00",
      date: "2024-11-16",
      listStudent: "UIR56480",
      avatar: "/placeholder.svg?height=32&width=32",
      status: "Cancelled"
    },
  ]

  const filteredReservations = selectedSport === "all" 
    ? reservations 
    : reservations.filter(r => r.sport.toLowerCase() === selectedSport)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3B8B]/5 to-[#1E3B8B]/10">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <img
              src="/placeholder.svg?height=40&width=40"
              alt="Logo"
              className="h-10 w-10"
            />
            <nav className="hidden gap-6 md:flex">
              {["Home", "Reservation", "List des Reservations", "Contact"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm font-medium text-[#1E3B8B] transition-colors hover:text-[#1E3B8B]/80"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-[#1E3B8B]"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Souhail Alaoui" />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">Souhail Alaoui</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#1E3B8B]">Reservation List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search reservations..."
                  className="pl-9"
                />
              </div>
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a sport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  <SelectItem value="football">Football</SelectItem>
                  <SelectItem value="padel">Padel</SelectItem>
                  <SelectItem value="tennis">Tennis</SelectItem>
                  <SelectItem value="volleyball">Volleyball</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? date.toDateString() : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#1E3B8B] hover:bg-[#1E3B8B]/90">
                  <TableHead className="text-white">Student</TableHead>
                  <TableHead className="text-white">Sport</TableHead>
                  <TableHead className="text-white">Time</TableHead>
                  <TableHead className="text-white">Date</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.map((reservation) => (
                  <TableRow key={`${reservation.studentCode}-${reservation.sport}`} className="hover:bg-[#1E3B8B]/5">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={reservation.avatar} alt={reservation.fullName} />
                          <AvatarFallback>{reservation.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{reservation.fullName}</div>
                          <div className="text-sm text-gray-500">{reservation.studentCode}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{reservation.sport}</TableCell>
                    <TableCell>{reservation.time}</TableCell>
                    <TableCell>{reservation.date}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={reservation.status === "Confirmed" ? "default" : 
                                reservation.status === "Pending" ? "secondary" : "destructive"}
                      >
                        {reservation.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing 1 to {filteredReservations.length} of {filteredReservations.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}