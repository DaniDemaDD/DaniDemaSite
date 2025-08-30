import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { spawn, type ChildProcess } from "child_process"
import { writeFileSync, mkdirSync, existsSync } from "fs"
import { join } from "path"

// Store running processes
const runningProcesses = new Map<string, ChildProcess>()

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { action, command } = await request.json()
    const botId = params.id

    // Get bot data
    const { data: bot, error } = await supabase.from("discord_bots").select("*").eq("id", botId).single()

    if (error || !bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    switch (action) {
      case "start":
        return await startBot(bot)
      case "stop":
        return await stopBot(bot)
      case "restart":
        await stopBot(bot)
        return await startBot(bot)
      case "execute":
        return await executeCommand(bot, command)
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Bot control error:", error)
    return NextResponse.json({ error: "Control action failed" }, { status: 500 })
  }
}

async function startBot(bot: any) {
  let process: ChildProcess
  try {
    // Create bot directory
    const botDir = join(process.cwd(), "bots", bot.id)
    if (!existsSync(botDir)) {
      mkdirSync(botDir, { recursive: true })
    }

    // Write bot file
    const fileName = bot.main_file || (bot.language === "python" ? "main.py" : "index.js")
    const filePath = join(botDir, fileName)
    writeFileSync(filePath, bot.file_content || "")

    // Write environment variables
    if (bot.environment_vars) {
      const envContent = Object.entries(bot.environment_vars)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n")
      writeFileSync(join(botDir, ".env"), envContent)
    }

    // Start the bot process
    const command = bot.language === "python" ? "python" : "node"
    const args = [fileName]

    process = spawn(command, args, {
      cwd: botDir,
      stdio: ["pipe", "pipe", "pipe"],
    })

    // Store the process
    runningProcesses.set(bot.id, process)

    // Handle process output
    let logs = ""
    process.stdout?.on("data", (data) => {
      const output = data.toString()
      logs += `[${new Date().toISOString()}] ${output}\n`
      updateBotLogs(bot.id, logs)
    })

    process.stderr?.on("data", (data) => {
      const output = data.toString()
      logs += `[${new Date().toISOString()}] ERROR: ${output}\n`
      updateBotLogs(bot.id, logs)
    })

    process.on("close", (code) => {
      logs += `[${new Date().toISOString()}] Process exited with code ${code}\n`
      updateBotLogs(bot.id, logs)
      runningProcesses.delete(bot.id)
      updateBotStatus(bot.id, "stopped")
    })

    // Update bot status
    await updateBotStatus(bot.id, "running")

    return NextResponse.json({
      success: true,
      message: "Bot started successfully",
      pid: process.pid,
    })
  } catch (error) {
    console.error("Start bot error:", error)
    if (process) {
      runningProcesses.delete(bot.id)
    }
    await updateBotStatus(bot.id, "error")
    return NextResponse.json({ error: "Failed to start bot" }, { status: 500 })
  }
}

async function stopBot(bot: any) {
  try {
    const process = runningProcesses.get(bot.id)
    if (process) {
      process.kill("SIGTERM")
      runningProcesses.delete(bot.id)
    }

    await updateBotStatus(bot.id, "stopped")

    return NextResponse.json({
      success: true,
      message: "Bot stopped successfully",
    })
  } catch (error) {
    console.error("Stop bot error:", error)
    return NextResponse.json({ error: "Failed to stop bot" }, { status: 500 })
  }
}

async function executeCommand(bot: any, command: string) {
  try {
    const process = runningProcesses.get(bot.id)
    if (!process) {
      return NextResponse.json({ error: "Bot is not running" }, { status: 400 })
    }

    // Send command to bot process
    process.stdin?.write(`${command}\n`)

    return NextResponse.json({
      success: true,
      message: "Command executed",
    })
  } catch (error) {
    console.error("Execute command error:", error)
    return NextResponse.json({ error: "Failed to execute command" }, { status: 500 })
  }
}

async function updateBotStatus(botId: string, status: string) {
  await supabase
    .from("discord_bots")
    .update({
      status,
      last_started: status === "running" ? new Date().toISOString() : undefined,
      last_stopped: status === "stopped" ? new Date().toISOString() : undefined,
    })
    .eq("id", botId)
}

async function updateBotLogs(botId: string, logs: string) {
  // Keep only last 1000 lines
  const lines = logs.split("\n")
  const recentLogs = lines.slice(-1000).join("\n")

  await supabase.from("discord_bots").update({ logs: recentLogs }).eq("id", botId)
}
