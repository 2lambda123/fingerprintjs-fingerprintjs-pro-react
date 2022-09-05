import { Env, type EnvDetails } from './env.types'

export interface DetectEnvContext {
  syntheticEventDetected?: boolean
  classRenderReceivesAnyArguments?: boolean
}

export interface DetectEnvParams {
  context: DetectEnvContext
}

type EnvCheckStrategy = () => unknown

function runEnvChecks(...strategies: EnvCheckStrategy[]) {
  if (typeof window === 'undefined') {
    return false
  }

  for (const strategy of strategies) {
    const result = strategy()

    if (result) {
      return true
    }
  }

  return false
}

/**
 * Runs checks that determine if user is using preact.
 * So far they are not ideal, as there is no consistent way to detect preact.
 * Right now the main determinant is if synthetic event was not detected.
 * */
function isPreact(context: DetectEnvContext) {
  return !context.syntheticEventDetected || context.classRenderReceivesAnyArguments
}

/**
 * Checks if user is using react.
 * So far we are doing that by checking if synthetic event was detected.
 * */
function isReact(context: DetectEnvContext) {
  return context.syntheticEventDetected
}

/**
 * Runs checks that determine if user is using next.
 * Those checks should have almost 100% accuracy.
 * */
function isNext() {
  return runEnvChecks(
    () => 'next' in window && Boolean((window as { next?: unknown }).next),
    () => document.querySelector('script[id=__NEXT_DATA__]')
  )
}

/**
 * Returns next version currently used by user.
 * */
function getNextVersion() {
  return (window as { next?: { version?: string } })?.next?.version
}

/**
 * Attempts to determine user environment.
 * */
export function detectEnvironment({ context }: DetectEnvParams): EnvDetails {
  if (isNext()) {
    return {
      name: Env.Next,
      version: getNextVersion(),
    }
  }

  if (isPreact(context)) {
    return {
      name: Env.Preact,
    }
  }

  if (isReact(context)) {
    return {
      name: Env.React,
    }
  }

  return {
    name: Env.Unknown,
  }
}
