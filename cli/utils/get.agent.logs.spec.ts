import * as FileSystem from "fs";
import { GetAgentLogs, provideGetAgentLogs } from "./get.agent.logs"

const data = require('../test_helpers/mockAgentLogs.json')

describe("getAgentLogs", () => {
  let getAgentLogs: GetAgentLogs
  const mockFortaApiUrl = "https://api.test"
  const mockAxios = {
    get: jest.fn()
  } as any

  const mockAgentsLogs: any[] = data.mockData;
  const mockAgentId = "0x15293"

  const resetMocks = () => {
    mockAxios.get.mockReset()
  }

  beforeEach(() => resetMocks())

  beforeAll(() => {
    getAgentLogs = provideGetAgentLogs(mockAxios, mockFortaApiUrl)
  })

  it("returns empty array when know fortaApiUrl is provided", async () => {
    const getAgentLogs = provideGetAgentLogs(mockAxios, "")

    await getAgentLogs(mockAgentId, new Date())
    expect(mockAxios.get).toHaveBeenCalledTimes(0)
  })

  it("returns array with single log found during a given minute", async () => {
    const moment = new Date(Date.parse("2022-03-20T12:42:00Z"));

    mockAxios.get.mockReturnValueOnce(
      { data: mockAgentsLogs.filter(log => new Date(log.timestamp).toISOString() === moment.toISOString())}
    );

    const logs = await getAgentLogs(mockAgentId, moment);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(logs.length).toBe(1);
  })

  it("returns empty array logs when no logs found during a given minute", async () => {
    const moment = new Date(Date.parse("1990-03-20T12:42:00Z"));

      mockAxios.get.mockReturnValueOnce(
        { data: mockAgentsLogs.filter(log => new Date(log.timestamp).toISOString() === moment.toISOString())}
      )

      const logs = await getAgentLogs(mockAgentId, moment);
      expect(mockAxios.get).toHaveBeenCalledTimes(1)
      expect(logs.length).toBe(0)
  })

  it("throws error if network request fail", async () => {
    const moment = new Date(Date.parse("1990-03-20T12:42:00Z"));
    const errorMessage = "Failed to make network request"
    try {
      mockAxios.get.mockReturnValueOnce({data: {error: {message: errorMessage}}})
      await getAgentLogs(mockAgentId, moment);
    } catch (e) {
      expect(mockAxios.get).toHaveBeenCalledTimes(1)
      expect(e.message).toBe(errorMessage)
    }
  })
})

