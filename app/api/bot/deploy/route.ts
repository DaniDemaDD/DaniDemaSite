import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { spawn, type ChildProcess } from "child_process"
import { writeFileSync, mkdirSync, existsSync, rmSync } from "fs"
import { join } from "path"

// Store the running bot process
let botProcess: ChildProcess | null = null
let botLogs: string[] = []

export async function POST(request: NextRequest) {
  try {
    const { action, envVars } = await request.json()

    switch (action) {
      case "deploy":
        return await deployBot(envVars)
      case "stop":
        return await stopBot()
      case "restart":
        await stopBot()
        return await deployBot(envVars)
      case "logs":
        return NextResponse.json({ logs: botLogs })
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Bot deploy error:", error)
    return NextResponse.json({ error: "Deploy failed" }, { status: 500 })
  }
}

async function deployBot(envVars: Record<string, string>) {
  try {
    // Stop existing bot if running
    if (botProcess) {
      botProcess.kill("SIGTERM")
      botProcess = null
    }

    // Clear old logs
    botLogs = []
    addLog("🚀 Starting deployment...")

    // Create bot directory
    const botDir = join(process.cwd(), "bot-runtime")
    if (existsSync(botDir)) {
      rmSync(botDir, { recursive: true, force: true })
    }
    mkdirSync(botDir, { recursive: true })

    addLog("📁 Created bot directory")

    // Clone the repository
    addLog("📥 Cloning repository from GitHub...")
    const cloneProcess = spawn("git", ["clone", "https://github.com/DaniDemaDD/BotManager.git", "."], {
      cwd: botDir,
      stdio: ["pipe", "pipe", "pipe"],
    })

    await new Promise((resolve, reject) => {
      cloneProcess.on("close", (code) => {
        if (code === 0) {
          addLog("✅ Repository cloned successfully")
          resolve(code)
        } else {
          addLog("❌ Failed to clone repository")
          reject(new Error(`Git clone failed with code ${code}`))
        }
      })
    })

    // Create .env file with environment variables
    if (envVars && Object.keys(envVars).length > 0) {
      const envContent = Object.entries(envVars)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n")
      writeFileSync(join(botDir, ".env"), envContent)
      addLog("🔧 Environment variables configured")
    }

    // Install dependencies
    addLog("📦 Installing dependencies...")
    const installProcess = spawn("pip", ["install", "-r", "requirements.txt"], {
      cwd: botDir,
      stdio: ["pipe", "pipe", "pipe"],
    })

    await new Promise((resolve, reject) => {
      installProcess.on("close", (code) => {
        if (code === 0) {
          addLog("✅ Dependencies installed")
          resolve(code)
        } else {
          addLog("❌ Failed to install dependencies")
          reject(new Error(`Pip install failed with code ${code}`))
        }
      })
    })

    // Start the bot
    addLog("🤖 Starting bot...")
    botProcess = spawn("python", ["main.py"], {
      cwd: botDir,
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, ...envVars },
    })

    // Handle bot output
    botProcess.stdout?.on("data", (data) => {
      const output = data.toString().trim()
      if (output) {
        addLog(`📤 ${output}`)
      }
    })

    botProcess.stderr?.on("data", (data) => {
      const output = data.toString().trim()
      if (output) {
        addLog(`❌ ${output}`)
      }
    })

    botProcess.on("close", (code) => {
      addLog(`🔴 Bot process exited with code ${code}`)
      botProcess = null
      updateBotStatus("stopped")
    })

    botProcess.on("error", (error) => {
      addLog(`💥 Bot error: ${error.message}`)
      botProcess = null
      updateBotStatus("error")
    })

    // Update bot status
    await updateBotStatus("running")
    addLog("🟢 Bot deployed and running!")

    return NextResponse.json({
      success: true,
      message: "Bot deployed successfully",
      status: "running",
    })
  } catch (error) {
    addLog(`💥 Deployment failed: ${error}`)
    await updateBotStatus("error")
    return NextResponse.json({ error: "Deployment failed" }, { status: 500 })
  }
}

async function stopBot() {
  try {
    if (botProcess) {
      addLog("🛑 Stopping bot...")
      botProcess.kill("SIGTERM")
      botProcess = null
      addLog("🔴 Bot stopped")
    }

    await updateBotStatus("stopped")

    return NextResponse.json({
      success: true,
      message: "Bot stopped",
      status: "stopped",
    })
  } catch (error) {
    addLog(`💥 Stop failed: ${error}`)
    return NextResponse.json({ error: "Failed to stop bot" }, { status: 500 })
  }
}

async function updateBotStatus(status: string) {
  try {
    const { error } = await supabase.from("discord_bots").upsert({
      id: "main-bot",
      name: "DaniDema Bot Manager",
      description: "Python Discord Bot from GitHub",
      status,
      language: "python",
      main_file: "main.py",
      updated_at: new Date().toISOString(),
      last_started: status === "running" ? new Date().toISOString() : undefined,
      last_stopped: status === "stopped" ? new Date().toISOString() : undefined,
    })

    if (error) {
      console.error("Failed to update bot status:", error)
    }
  } catch (error) {
    console.error("Database update error:", error)
  }
}

function addLog(message: string) {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19)
  const logEntry = `[${timestamp}] ${message}`
  botLogs.push(logEntry)

  // Keep only last 100 logs
  if (botLogs.length > 100) {
    botLogs = botLogs.slice(-100)
  }

  console.log(logEntry)
}
