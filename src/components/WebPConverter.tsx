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
            
            img.onload = () => {
               const maxDimension = 4000 // # SIZE
               let { width, height } = img
               
               if (width > maxDimension || height > maxDimension) {
                  if (width > height) {
                     height = (height / width) * maxDimension
                     width = maxDimension
                  } else {
                     width = (width / height) * maxDimension
                     height = maxDimension
                  }
               }
               
               canvas.width = width
               canvas.height = height
               const ctx = canvas.getContext('2d')
               
               if (!ctx) {
                  reject(new Error('Could not get canvas context'))
                  return
               }
               
               ctx.drawImage(img, 0, 0, width, height)
               
               canvas.toBlob(
                  (blob) => {
                     if (!blob) {
                        reject(new Error('Conversion failed'))
                        return
                     }
                     
                     const webpFile = new File(
                        [blob],
                        file.name.replace(/\.(jpg|jpeg|png|gif|bmp)$/i, '.webp'),
                        { type: 'image/webp' }
                     )
                     
                     resolve(webpFile)
                  },
                  'image/webp',
                  0.90 // # QUALITY
               )
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