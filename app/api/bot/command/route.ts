import { type NextRequest, NextResponse } from "next/server"

// Store command history
let commandHistory: string[] = []

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json()

    if (!command || typeof command !== "string") {
      return NextResponse.json({ error: "Invalid command" }, { status: 400 })
    }

    // Add to command history
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19)
    const commandEntry = `[${timestamp}] $ ${command}`
    commandHistory.push(commandEntry)

    // Keep only last 50 commands
    if (commandHistory.length > 50) {
      commandHistory = commandHistory.slice(-50)
    }

    // Simulate command execution (in a real implementation, you'd send this to the bot process)
    let response = ""
    switch (command.toLowerCase().trim()) {
      case "help":
        response = "Available commands: help, status, ping, restart, logs"
        break
      case "status":
        response = "Bot is running and connected to Discord"
        break
      case "ping":
        response = "Pong! Bot is responsive"
        break
      case "restart":
        response = "Restarting bot..."
        break
      case "logs":
        response = "Displaying recent logs..."
        break
      default:
        response = `Command '${command}' executed`
    }

    const responseEntry = `[${timestamp}] ${response}`
    commandHistory.push(responseEntry)

    return NextResponse.json({
      success: true,
      command,
      response,
      history: commandHistory,
    })
  } catch (error) {
    console.error("Command execution error:", error)
    return NextResponse.json({ error: "Command failed" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ history: commandHistory })
}
