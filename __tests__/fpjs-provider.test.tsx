import { useContext } from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { FpjsContext } from '../src'
import { createWrapper, getDefaultLoadOptions } from './helpers'
import { CacheLocation, FpjsClient, FpjsClientOptions } from '@fingerprintjs/fingerprintjs-pro-spa'

jest.mock('@fingerprintjs/fingerprintjs-pro-spa', () => {
  return {
    ...jest.requireActual('@fingerprintjs/fingerprintjs-pro-spa'),
    FpjsClient: jest.fn(),
  }
})

describe(`FpjsProvider`, () => {
  it('should configure an instance of the FpjsClient', async () => {
    const loadOptions = getDefaultLoadOptions()
    const options: FpjsClientOptions = {
      loadOptions,
      cacheLocation: CacheLocation.LocalStorage,
      cachePrefix: 'TEST_PREFIX',
      cacheTimeInSeconds: 60 * 15,
    }
    const wrapper = createWrapper(options)
    renderHook(() => useContext(FpjsContext), {
      wrapper,
    })
    expect(FpjsClient).toHaveBeenCalledWith(
      expect.objectContaining({
        loadOptions: expect.objectContaining({ ...loadOptions }),
        cacheLocation: CacheLocation.LocalStorage,
        cachePrefix: 'TEST_PREFIX',
        cacheTimeInSeconds: 60 * 15,
      })
    )
  })
})