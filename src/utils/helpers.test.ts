import { describe, it, expect } from 'vitest'
import { Helpers } from './helpers'
import type { WebComponent, DeviceType } from '../types'

describe('Helpers', () => {
  describe('getDeviceIP', () => {
    it('returns correct IP for known device types', () => {
      expect(Helpers.getDeviceIP('router1')).toBe('192.168.1.1')
      expect(Helpers.getDeviceIP('client')).toBe('192.168.1.100')
      expect(Helpers.getDeviceIP('webServer')).toBe('93.184.216.34')
      expect(Helpers.getDeviceIP('dnsServer')).toBe('8.8.8.8')
    })

    it('returns default IP for unknown device types', () => {
      expect(Helpers.getDeviceIP('unknown' as DeviceType)).toBe('127.0.0.1')
    })
  })

  describe('generatePacketInfo', () => {    it('generates DNS packet info for dns scenario', () => {
      const packetInfo = Helpers.generatePacketInfo('query', 'client', 'router1', 'dns')
      
      expect(packetInfo.source).toMatch(/^192\.168\.1\.100:\d+$/)
      expect(packetInfo.destination).toBe('192.168.1.1:53')
      expect(packetInfo.protocol).toBe('DNS (UDP)')
      expect(packetInfo.size).toMatch(/^\d+ bytes$/)
    })

    it('generates HTTPS packet info for non-dns scenarios', () => {
      const packetInfo = Helpers.generatePacketInfo('request', 'client', 'router1', 'basic')
      
      expect(packetInfo.source).toMatch(/^192\.168\.1\.100:\d+$/)
      expect(packetInfo.destination).toBe('192.168.1.1:443')
      expect(packetInfo.protocol).toBe('HTTPS (TCP)')
      expect(packetInfo.size).toMatch(/^\d+ bytes$/)
    })

    it('generates packet with random source port', () => {
      const packet1 = Helpers.generatePacketInfo('request', 'client', 'router1', 'basic')
      const packet2 = Helpers.generatePacketInfo('request', 'client', 'router1', 'basic')
      
      // Extract port numbers
      const port1 = packet1.source.split(':')[1]
      const port2 = packet2.source.split(':')[1]
      
      // Ports should be within expected range
      expect(parseInt(port1)).toBeGreaterThanOrEqual(54321)
      expect(parseInt(port1)).toBeLessThanOrEqual(55321)
      expect(parseInt(port2)).toBeGreaterThanOrEqual(54321)
      expect(parseInt(port2)).toBeLessThanOrEqual(55321)
    })

    it('generates packet with random size', () => {
      const packetInfo = Helpers.generatePacketInfo('request', 'client', 'router1', 'basic')
      const sizeMatch = packetInfo.size.match(/^(\d+) bytes$/)
      
      expect(sizeMatch).toBeTruthy()
      const size = parseInt(sizeMatch![1])
      expect(size).toBeGreaterThanOrEqual(100)
      expect(size).toBeLessThanOrEqual(1500)
    })
  })

  describe('generateWebComponentPacketInfo', () => {
    it('generates correct packet info for html component with webServer route', () => {
      const component: WebComponent = {
        name: 'HTML Document',
        source: '93.184.216.34',
        type: 'html',
        route: ['client', 'router1', 'webServer'],
        size: '15 KB'
      }
      
      const packetInfo = Helpers.generateWebComponentPacketInfo(component)
      
      expect(packetInfo.source).toMatch(/^192\.168\.1\.100:\d+$/)
      expect(packetInfo.destination).toBe('93.184.216.34:443')
      expect(packetInfo.protocol).toBe('HTTPS (TCP)')
      expect(packetInfo.size).toBe('15 KB')
      expect(packetInfo.request).toBe('GET /html.document')
    })

    it('generates correct packet info for css component with cdnServer route', () => {
      const component: WebComponent = {
        name: 'Stylesheet',
        source: '151.101.1.140',
        type: 'css',
        route: ['client', 'router1', 'cdnServer'],
        size: '8 KB'
      }
      
      const packetInfo = Helpers.generateWebComponentPacketInfo(component)
      
      expect(packetInfo.source).toMatch(/^192\.168\.1\.100:\d+$/)
      expect(packetInfo.destination).toBe('151.101.1.140:443')
      expect(packetInfo.protocol).toBe('HTTPS (TCP)')
      expect(packetInfo.size).toBe('8 KB')
      expect(packetInfo.request).toBe('GET /stylesheet')
    })
  })
})
