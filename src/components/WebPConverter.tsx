'use client'

import { useEffect } from 'react'

export const WebPConverter = () => {
   useEffect(() => {
      const convertToWebP = async (file: File): Promise<File> => {
         if (!file.type.startsWith('image/')) return file
         if (file.type === 'image/webp') return file
         if (file.type === 'image/svg+xml') return file
         
         return new Promise((resolve, reject) => {
            const img = new Image()
            const canvas = document.createElement('canvas')
            
            img.onload = async () => {
               let { width, height } = img
               const isVertical = height > width
               
               const maxWidth = isVertical ? 2160 : 3840
               const maxHeight = isVertical ? 3840 : 2160
               
               if (width > maxWidth || height > maxHeight) {
                  const widthRatio = maxWidth / width
                  const heightRatio = maxHeight / height
                  const ratio = Math.min(widthRatio, heightRatio)
                  
                  width = Math.round(width * ratio)
                  height = Math.round(height * ratio)
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
                     return resolve(webpFile)
                  }
               }
               
               reject(new Error('Could not compress below 4.5MB'))
            }
            
            img.onerror = () => reject(new Error('Failed to load image'))
            img.src = URL.createObjectURL(file)
         })
      }
      
      const originalSend = XMLHttpRequest.prototype.send
      const originalOpen = XMLHttpRequest.prototype.open
      
      const pendingRequests = new WeakMap<XMLHttpRequest, { url: string }>()
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      XMLHttpRequest.prototype.open = function(this: XMLHttpRequest, ...args: any[]) {
         const url = args[1]
         if (url) {
            pendingRequests.set(this, { url: url.toString() })
         }
         // eslint-disable-next-line prefer-rest-params
         return originalOpen.apply(this, args as any)
      }
      
      XMLHttpRequest.prototype.send = async function(body?: Document | XMLHttpRequestBodyInit | null) {
         const requestInfo = pendingRequests.get(this)
         
         if (requestInfo && requestInfo.url.includes('/api/media') && body instanceof FormData) {
            const newFormData = new FormData()
            let modified = false
            
            for (const [key, value] of Array.from(body as FormData)) {
               if (value instanceof File && value.type.startsWith('image/')) {
                  try {
                     const converted = await convertToWebP(value)
                     newFormData.append(key, converted)
                     modified = true
                  } catch (error) {
                     newFormData.append(key, value)
                  }
               } else {
                  newFormData.append(key, value)
               }
            }
            
            if (modified) {
               return originalSend.call(this, newFormData)
            }
         }
         
         return originalSend.call(this, body)
      }
      
      const originalFetch = window.fetch
      window.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
         const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
         
         if (url.includes('/api/media') && init?.body instanceof FormData) {
            const newFormData = new FormData()
            let modified = false
            
            for (const [key, value] of Array.from(init.body as FormData)) {
               if (value instanceof File && value.type.startsWith('image/')) {
                  try {
                     const converted = await convertToWebP(value)
                     newFormData.append(key, converted)
                     modified = true
                  } catch (error) {
                     newFormData.append(key, value)
                  }
               } else {
                  newFormData.append(key, value)
               }
            }
            
            if (modified) {
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
   
   return null
};