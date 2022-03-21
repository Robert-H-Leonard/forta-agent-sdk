import provideLogs from "."
import { CommandHandler } from "../.."

describe("logs", () => {
  let logs: CommandHandler
  const mockContainer = {
    resolve: jest.fn()
  } as any

  const mockScannerId = "0x1234"
  const mockAgentId = "0x15293"

  const resetMocks = () => {
    mockContainer.resolve.resetMocks()
  }

  beforeEach(() => resetMocks())

  beforeAll(() => {
    logs = provideLogs(mockContainer)
  })

  it("throws error if no agentId provided", async () => {

  })

  it("throws error if invalid timestamp provided for --after ", async () => {
  })

  it("throws error if invalid timestamp provided for --before ", async () => {
  })

  it("throws error if the requested latest timestamp is before the earliest ", async () => {
  })

  it("defaults to last 24 hours of logs ", async () => {
  })

  it("only prints latest log ", async () => {
  })

  it(" only prints earliest log ", async () => {
  })

  it(" only prints logs within provided time range ", async () => {
    
  })

  it("throws exception if network request fail", async () => {
  })
})