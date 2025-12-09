'use client'

import { useEffect } from 'react'

export const WebPConverter = () => {
   useEffect(() => {
      const convertToWebP = async (file: File): Promise<File> => {
         if (!file.type.startsWith('image/')) return file
         if (file.type === 'image/webp') return file
         if (file.type === 'image/svg+xml') return file
         
         console.log('Original file:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB')
         
         return new Promise((resolve, reject) => {
            const img = new Image()
            const canvas = document.createElement('canvas')
            
            img.onload = async () => {
               let { width, height } = img
               const isVertical = height > width
               
               console.log('Original dimensions:', width, 'x', height, isVertical ? '(vertical)' : '(horizontal)')
               
               const maxWidth = isVertical ? 2160 : 3840
               const maxHeight = isVertical ? 3840 : 2160
               
               if (width > maxWidth || height > maxHeight) {
                  const widthRatio = maxWidth / width
                  const heightRatio = maxHeight / height
                  const ratio = Math.min(widthRatio, heightRatio)
                  
                  width = Math.round(width * ratio)
                  height = Math.round(height * ratio)
                  console.log('Resized to:', width, 'x', height)
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
               let quality = 0.85
               const minQuality = 0.50
               
               const tryConvert = (currentQuality: number): Promise<Blob | null> => {
                  return new Promise((res) => {
                     canvas.toBlob(
                        (blob) => res(blob),
                        'image/webp',
                        currentQuality
                     )
                  })
               }
               
               let blob = await tryConvert(quality)
               console.log('Initial conversion at', (quality * 100) + '%:', blob ? (blob.size / 1024 / 1024).toFixed(2) + ' MB' : 'failed')
               
               while (blob && blob.size > maxFileSize && quality > minQuality) {
                  quality -= 0.05
                  if (quality < minQuality) quality = minQuality
                  blob = await tryConvert(quality)
                  if (blob) {
                     console.log('Trying quality', (quality * 100) + '%:', (blob.size / 1024 / 1024).toFixed(2), 'MB')
                  }
               }
               
               if (!blob) {
                  reject(new Error('Conversion failed'))
                  return
               }
               
               console.log('Final file size:', (blob.size / 1024 / 1024).toFixed(2), 'MB at', (quality * 100) + '% quality')
               
               const webpFile = new File(
                  [blob],
                  file.name.replace(/\.(jpg|jpeg|png|gif|bmp)$/i, '.webp'),
                  { type: 'image/webp' }
               )
               
               resolve(webpFile)
            }
            
            img.onerror = () => reject(new Error('Failed to load image'))
            img.src = URL.createObjectURL(file)
         })
      }
      
      const convertedFiles = new WeakMap<HTMLInputElement, string>()
      
      const handleFileSelect = async (e: Event) => {
         const input = e.target as HTMLInputElement
         
         if (input.type !== 'file') return
         if (!input.files || input.files.length === 0) return
         
         const file = input.files[0]
         
         if (convertedFiles.get(input) === file.name) return
         if (!file.type.startsWith('image/')) return
         if (file.type === 'image/webp') return
         if (file.type === 'image/svg+xml') return
         
         e.stopImmediatePropagation()
         e.preventDefault()
         
         try {
            const convertedFile = await convertToWebP(file)
            
            const dt = new DataTransfer()
            dt.items.add(convertedFile)
            input.files = dt.files
            
            convertedFiles.set(input, convertedFile.name)
            
            const newEvent = new Event('change', { bubbles: true })
            input.dispatchEvent(newEvent)
            
         } catch (error) {
            console.error('Conversion error:', error)
            convertedFiles.set(input, file.name)
         }
      }
      
      document.addEventListener('change', handleFileSelect, { capture: true })
      
      return () => {
         document.removeEventListener('change', handleFileSelect, { capture: true })
      }
   }, [])
   
   return null
};