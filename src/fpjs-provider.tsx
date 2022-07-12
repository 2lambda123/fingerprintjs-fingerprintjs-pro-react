import { MouseEventHandler, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import FpjsContext from './fpjs-context'
import { Agent, FpjsClient, FpjsClientOptions } from '@fingerprintjs/fingerprintjs-pro-spa'
import * as packageInfo from '../package.json'
import { agentServerMock } from './agent-server-mock'
import { isSSR } from './ssr'
import { getEnvironment } from './get-env'
import { type DetectEnvContext } from './detect-env'
import type { EnvDetails } from './env.types'

const pkgName = packageInfo.name.split('/')[1]

interface FpjsProviderOptions extends FpjsClientOptions {
  /**
   * If set to `true`, will force FpjsClient to be rebuilt with the new options. Should be used with caution
   * since it can be triggered too often (e.g. on every render) and negatively affect performance of the JS agent.
   */
  forceRebuild?: boolean
}

/**
 * @example
 * ```jsx
 * <FpjsProvider
 *   loadOptions = {{
 *     apiKey: "<your-fpjs-public-api-key>"
 *   }}
 *   cacheTime={60 * 10}
 *   cacheLocation={CacheLocation.LocalStorage}
 * >
 *   <MyApp />
 * </FpjsProvider>
 * ```
 *
 * Provides the FpjsContext to its child components.
 */
export function FpjsProvider<TExtended extends boolean>({
  children,
  forceRebuild,
  cache,
  cacheTimeInSeconds,
  cachePrefix,
  cacheLocation,
  loadOptions,
}: PropsWithChildren<FpjsProviderOptions>) {
  const [env, setEnv] = useState<EnvDetails | undefined>()

  const [envContext, setEnvContext] = useState<DetectEnvContext | undefined>()

  const clientOptions = useMemo(() => {
    const integrationInfo = [...(loadOptions.integrationInfo || []), `${pkgName}/${packageInfo.version}`]

    if (env) {
      const envInfo = env.version ? `${env.name}/${env.version}` : env.name
      integrationInfo.push(`${pkgName}/${packageInfo.version}/${envInfo}`)
    }

    return {
      cache,
      cacheTimeInSeconds,
      cachePrefix,
      cacheLocation,
      loadOptions: {
        ...loadOptions,
        integrationInfo,
      },
    }
  }, [loadOptions, env, cache, cacheTimeInSeconds, cachePrefix, cacheLocation])

  const [client, setClient] = useState<FpjsClient>(() => new FpjsClient(clientOptions))

  useEffect(() => {
    if (forceRebuild) {
      setClient(new FpjsClient(clientOptions))
    }
  }, [forceRebuild, clientOptions])

  const clientPromise = useRef<Promise<Agent>>(
    new Promise((resolve) => {
      if (!isSSR()) {
        resolve(client.init())
      } else {
        resolve(agentServerMock)
      }
    })
  )
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender) {
      firstRender.current = false
    } else {
      clientPromise.current = client.init()
    }
  }, [client])

  const getVisitorData = useCallback(
    async (options, ignoreCache) => {
      await clientPromise.current
      return client.getVisitorData<TExtended>(options, ignoreCache)
    },
    [client]
  )

  const handleEnvSpanCheck = useCallback<MouseEventHandler>((event) => {
    const isSyntheticEvent =
      Boolean((event as Record<string, any>)['_reactName']) || event?.constructor?.name === 'SyntheticBaseEvent'

    const context: DetectEnvContext = {
      syntheticEventDetected: isSyntheticEvent,
    }

    setEnvContext(context)

    setEnv(getEnvironment({ context }))
  }, [])

  const clearCache = useCallback(async () => {
    await client.clearCache()
  }, [client])

  const contextValue = useMemo(() => {
    return {
      clearCache,
      getVisitorData,
    }
  }, [clearCache, getVisitorData])

  return (
    <FpjsContext.Provider value={contextValue}>
      {!envContext && (
        <span
          style={{ display: 'none' }}
          onClick={handleEnvSpanCheck}
          ref={(element) => {
            if (element && !isSSR()) {
              element.click()
            }
          }}
        />
      )}
      {children}
    </FpjsContext.Provider>
  )
}
