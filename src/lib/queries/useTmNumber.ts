import { extractIdFromUrl } from '@/lib/api/client'
import { useMove } from './useMove'
import { useMachine } from './useMachine'

// Shared by Move Detail and Pokémon Detail's TM tab — resolves a move to its
// TM item name (e.g. "tm11") for a given version group. TM numbers aren't on
// the move resource directly; they only exist via the machine resource, which
// this hook fetches lazily and caches independently so both call sites share it.
export function useTmNumber(moveName: string | undefined, versionGroup: string) {
  const move = useMove(moveName)
  const machineUrl = move.data?.machines.find((m) => m.version_group.name === versionGroup)
    ?.machine.url
  const machineId = machineUrl ? extractIdFromUrl(machineUrl) : undefined
  const machine = useMachine(machineId)

  return {
    tmName: machine.data?.item.name,
    isLoading: move.isLoading || (!!machineId && machine.isLoading),
    hasNoMachine: move.isSuccess && !machineUrl,
  }
}
