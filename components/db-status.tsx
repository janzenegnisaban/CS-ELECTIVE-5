"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function DatabaseStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [message, setMessage] = useState<string>("")
  const [isChecking, setIsChecking] = useState(false)

  const checkDatabaseConnection = async () => {
    try {
      setIsChecking(true)
      const response = await fetch("/api/health")
      const data = await response.json()

      if (response.ok && data.database === "connected") {
        setStatus("connected")
        setMessage("Database connected successfully")
      } else {
        setStatus("error")
        setMessage(data.message || "Database connection failed")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Failed to check database connection")
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkDatabaseConnection()

    // Set up periodic health checks
    const interval = setInterval(() => {
      checkDatabaseConnection()
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  if (status === "loading") {
    return (
      <Alert className="fixed bottom-4 right-4 w-auto max-w-md z-50 bg-yellow-50 border-yellow-200">
        <RefreshCw className="h-4 w-4 animate-spin text-yellow-500" />
        <AlertDescription>Checking database connection...</AlertDescription>
      </Alert>
    )
  }

  if (status === "error") {
    return (
      <Alert variant="destructive" className="fixed bottom-4 right-4 w-auto max-w-md z-50">
        <AlertCircle className="h-4 w-4" />
        <div className="flex flex-col">
          <AlertTitle>Database Error</AlertTitle>
          <AlertDescription>{message}. Some features may not work properly.</AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 self-end"
            onClick={checkDatabaseConnection}
            disabled={isChecking}
          >
            {isChecking ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Retry Connection"
            )}
          </Button>
        </div>
      </Alert>
    )
  }

  // Show a success message briefly
  if (status === "connected") {
    setTimeout(() => {
      setStatus("loading")
      setMessage("")
    }, 3000)

    return (
      <Alert className="fixed bottom-4 right-4 w-auto max-w-md z-50 bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertDescription>Database connected successfully!</AlertDescription>
      </Alert>
    )
  }

  return null
}
