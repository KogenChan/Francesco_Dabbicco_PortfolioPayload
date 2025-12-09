'use client'

import { useEffect } from 'react'

export const WebPConverter = () => {
   useEffect(() => {
      console.log('✓ WebP converter loaded')
      
      const convertToWebP = async (file: File): Promise<File> => {
         if (!file.type.startsWith('image/')) return file
         if (file.type === 'image/webp') return file
         if (file.type === 'image/svg+xml') return file
         
         console.log('🔄 Converting:', file.name, (file.size / 1024 / 1024).toFixed(2) + 'MB')
         
         return new Promise((resolve, reject) => {
            const img = new Image()
            const canvas = document.createElement('canvas')
            
            img.onload = async () => {
               let { width, height } = img
               const isVertical = height > width
               
               console.log('   Original:', width + 'x' + height, isVertical ? '(vertical)' : '(horizontal)')
               
               const maxWidth = isVertical ? 2160 : 3840
               const maxHeight = isVertical ? 3840 : 2160
               
               if (width > maxWidth || height > maxHeight) {
                  const ratio = Math.min(maxWidth / width, maxHeight / height)
                  width = Math.round(width * ratio)
                  height = Math.round(height * ratio)
                  console.log('   Resized to:', width + 'x' + height)
               }
               
               canvas.width = width
               canvas.height = height
               const ctx = canvas.getContext('2d')
               
               if (!ctx) {
                  reject(new Error('Could not get canvas context'))
                  return
               }
               
               ctx.drawImage(img, 0, 0, width, height)
               
               const maxFileSize = 4.5 * 1024 * 1024
               const qualities = [0.85, 0.75, 0.65, 0.55, 0.50]
               
               for (const quality of qualities) {
                  const blob = await new Promise<Blob | null>(res => {
                     canvas.toBlob(blob => res(blob), 'image/webp', quality)
                  })
                  
                  if (blob && blob.size <= maxFileSize) {
                     const webpFile = new File(
                        [blob],
                        file.name.replace(/\.(jpg|jpeg|png|gif|bmp)$/i, '.webp'),
                        { type: 'image/webp' }
                     )
                     console.log('   ✓ Success:', (webpFile.size / 1024 / 1024).toFixed(2) + 'MB at ' + Math.round(quality * 100) + '%')
                     return resolve(webpFile)
                  }
               }
               
               reject(new Error('Could not compress below 4.5MB'))
            }
            
            img.onerror = () => reject(new Error('Failed to load image'))
            img.src = URL.createObjectURL(file)
         })
      }
      
      // Intercept XMLHttpRequest to modify FormData before upload
      const originalSend = XMLHttpRequest.prototype.send
      const originalOpen = XMLHttpRequest.prototype.open
      
      const pendingRequests = new WeakMap<XMLHttpRequest, { url: string }>()
      
      XMLHttpRequest.prototype.open = function(method: string, url: string | URL) {
         pendingRequests.set(this, { url: url.toString() })
         // @ts-ignore - Arguments forwarding
         return originalOpen.apply(this, arguments)
      }
      
      XMLHttpRequest.prototype.send = async function(body?: Document | XMLHttpRequestBodyInit | null) {
         const requestInfo = pendingRequests.get(this)
         
         // Only intercept uploads to the media API endpoint
         if (requestInfo && requestInfo.url.includes('/api/media') && body instanceof FormData) {
            console.log('📤 Intercepting upload to:', requestInfo.url)
            
            const newFormData = new FormData()
            let modified = false
            
            for (const [key, value] of (body as any).entries()) {
               if (value instanceof File && value.type.startsWith('image/')) {
                  try {
                     console.log('🖼️  Found image field:', key)
                     const converted = await convertToWebP(value)
                     newFormData.append(key, converted)
                     modified = true
                  } catch (error) {
                     console.error('❌ Conversion failed:', error)
                     newFormData.append(key, value)
                  }
               } else {
                  newFormData.append(key, value)
               }
            }
            
            if (modified) {
               console.log('✅ Sending converted file')
               return originalSend.call(this, newFormData)
            }
         }
         
         return originalSend.call(this, body)
      }
      
      // Also intercept fetch API
      const originalFetch = window.fetch
      window.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
         const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
         
         if (url.includes('/api/media') && init?.body instanceof FormData) {
            console.log('📤 Intercepting fetch upload to:', url)
            
            const newFormData = new FormData()
            let modified = false
            
            for (const [key, value] of (init.body as any).entries()) {
               if (value instanceof File && value.type.startsWith('image/')) {
                  try {
                     console.log('🖼️  Found image field:', key)
                     const converted = await convertToWebP(value)
                     newFormData.append(key, converted)
                     modified = true
                  } catch (error) {
                     console.error('❌ Conversion failed:', error)
                     newFormData.append(key, value)
                  }
               } else {
                  newFormData.append(key, value)
               }
            }
            
            if (modified) {
               console.log('✅ Sending converted file via fetch')
               return originalFetch(input, { ...init, body: newFormData })
            }
         }
         
         return originalFetch(input, init)
      }
      
      return () => {
         XMLHttpRequest.prototype.send = originalSend
         XMLHttpRequest.prototype.open = originalOpen
         window.fetch = originalFetch
      }
   }, [])
   
   return (
      <div style={{ 
         position: 'fixed', 
         bottom: '10px', 
         right: '10px', 
         background: '#10b981', 
         color: 'white', 
         padding: '4px 8px',
         borderRadius: '4px',
         fontSize: '11px',
         zIndex: 9999,
         fontFamily: 'monospace'
      }}>
         WebP ✓
      </div>
   )
};