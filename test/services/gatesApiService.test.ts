import { describe, it, expect, vi, beforeEach } from 'vitest'
import { gatesApiAxios, generateResponse } from '@/services/gatesApiService'

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => (
      {
        post: vi.fn(),
      }
    )),
  },
}))

describe('gatesApiService', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('should successfully generate response with valid data', async () => {
    const mockResponse = {
      status: 200,
      data: {
        status: 'success',
        response: {
          id: 'test-layer',
          parsed: {
            parsed_text: 'Test response',
            parsed_blocks: {
              json: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: [0, 0]
                  },
                  properties: {}
                }
              ]
            }
          }
        }
      }
    }

    vi.spyOn(gatesApiAxios, 'post').mockResolvedValueOnce(mockResponse)

    const result = await generateResponse('test message')

    expect(gatesApiAxios.post).toHaveBeenCalledWith('/mcp/connect/', {
      query: 'test message',
      request: 'GIS WebApp'
    })

    expect(result).toEqual({
      text: 'Test response',
      geoJson: {
        type: 'FeatureCollection',
        features: mockResponse.data.response.parsed.parsed_blocks.json
      },
      layerName: 'test-layer'
    })
  })

  it('should throw error when API call fails', async () => {
    const mockError = new Error('API Error')
    vi.spyOn(gatesApiAxios, 'post').mockRejectedValue(mockError)

    await expect(generateResponse('test message')).rejects.toThrow('API Error')

    expect(gatesApiAxios.post).toHaveBeenCalledWith('/mcp/connect/', {
      query: 'test message',
      request: 'GIS WebApp'
    })
  })
})