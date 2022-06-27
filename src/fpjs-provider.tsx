import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import FpjsContext from './fpjs-context'
import { FpjsClient, FpjsClientOptions, Agent } from '@fingerprintjs/fingerprintjs-pro-spa'
import * as packageInfo from '../package.json'
import { agentServerMock } from './agent-server-mock'

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
  const clientOptions = useMemo(() => {
    return {
      cache,
      cacheTimeInSeconds,
      cachePrefix,
      cacheLocation,
      loadOptions: {
        ...loadOptions,
        integrationInfo: [...(loadOptions.integrationInfo || []), `fingerprintjs-pro-react/${packageInfo.version}`],
      },
    }
  }, [cache, cacheTimeInSeconds, cachePrefix, cacheLocation, loadOptions])

  const [client, setClient] = useState<FpjsClient>(() => new FpjsClient(clientOptions))

  useEffect(() => {
    if (forceRebuild) {
      setClient(new FpjsClient(clientOptions))
    }
  }, [forceRebuild, clientOptions])

  const clientPromise = useRef<Promise<Agent>>(
    new Promise((resolve) => {
      if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
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

  const clearCache = useCallback(async () => {
    await client.clearCache()
  }, [client])

  const contextValue = useMemo(() => {
    return {
      clearCache,
      getVisitorData,
    }
  }, [clearCache, getVisitorData])

  return <FpjsContext.Provider value={contextValue}>{children}</FpjsContext.Provider>
}
