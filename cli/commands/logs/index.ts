import { AwilixContainer } from 'awilix';
import { CommandHandler } from "../..";
import { assertExists, assertIsISOString, isValidTimeRange } from "../../utils";
import { GetAgentLogs } from '../../utils/get.agent.logs';

const SECONDS_IN_A_DAY = 86400;

export default function provideLogs(
  container: AwilixContainer
): CommandHandler {
  assertExists(container, 'container')

  return async function logs(cliArgs: any) {
    const getAgentLogs = container.resolve<GetAgentLogs>('getAgentLogs')
    
    const agentId = cliArgs.agentId
    if(!agentId) throw new Error(`No agentId provided`)

    
    const latestTimestamp = cliArgs.before
    let earliestTimestamp = cliArgs.after

    // If no time range entered
    if(!latestTimestamp && !earliestTimestamp) {
      // Default to the last 24 hours
      earliestTimestamp = new Date(Date.now() - SECONDS_IN_A_DAY * 1000).toISOString()
    }

    // Validate passed in timestamps
    if(earliestTimestamp) { assertIsISOString(earliestTimestamp) }
    if(latestTimestamp) { assertIsISOString(latestTimestamp)}

    if(!isValidTimeRange(earliestTimestamp, latestTimestamp)) throw Error(`Provided date range is invalid`)


    const scanDirection = shouldScanForwardOrBackward(earliestTimestamp, latestTimestamp)

    const earliestDateTime = new Date(earliestTimestamp)
    const latestDateTime = new Date(latestTimestamp)

    let curMinute: Date | undefined = scanDirection === "forward" ? earliestDateTime : latestDateTime

    while(curMinute) {
      const logs = await getAgentLogs(agentId, curMinute)
      if(logs?.length > 0) {
        logs.filter(log => !cliArgs.scannerId || log.scanner === cliArgs.scannerId)
        .forEach(log => console.log(log))
      }
      curMinute = getNextMinute(curMinute, scanDirection, earliestDateTime, latestDateTime)
    }
  }
}

export type ScanDirection = 'forward' | 'backward';

export const shouldScanForwardOrBackward = (earliestTimestamp?: string, latestTimestamp?: string): ScanDirection => {
  if(earliestTimestamp && !latestTimestamp) return "forward"
  else if (latestTimestamp && !earliestTimestamp) return "backward"
  return "forward"
}

export const getNextMinute = (curMinute: Date, direction: ScanDirection, earliestTimestamp?: Date, latestTimestamp?: Date): Date | undefined => {
  const nextMinute = direction === "forward" 
    ? new Date(curMinute.getTime() + (60 * 1000))
    : new Date(curMinute.getTime() - (60 * 1000))

  if(direction === "forward") {
    return !latestTimestamp || latestTimestamp && nextMinute <= latestTimestamp ? nextMinute : undefined
  } else {
    return !earliestTimestamp || earliestTimestamp && nextMinute >= earliestTimestamp ? nextMinute : undefined
  }
}

