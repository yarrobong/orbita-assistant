import { mkdir, writeFile } from 'node:fs/promises'
import { deflateSync } from 'node:zlib'

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let value = n
  for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
  return value >>> 0
})
function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const name = Buffer.from(type)
  const length = Buffer.alloc(4); length.writeUInt32BE(data.length)
  const checksum = Buffer.alloc(4); checksum.writeUInt32BE(crc32(Buffer.concat([name, data])))
  return Buffer.concat([length, name, data, checksum])
}
function png(size) {
  const pixels = Buffer.alloc((size * 4 + 1) * size)
  const center = size / 2
  const outer = size * 0.31
  const inner = size * 0.235
  for (let y = 0; y < size; y += 1) {
    const row = y * (size * 4 + 1)
    pixels[row] = 0
    for (let x = 0; x < size; x += 1) {
      const offset = row + 1 + x * 4
      const distance = Math.hypot(x + 0.5 - center, y + 0.5 - center)
      const ring = distance <= outer && distance >= inner
      const color = ring ? [189, 87, 47] : [255, 255, 255]
      pixels[offset] = color[0]; pixels[offset + 1] = color[1]; pixels[offset + 2] = color[2]; pixels[offset + 3] = 255
    }
  }
  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0); header.writeUInt32BE(size, 4)
  header[8] = 8; header[9] = 6; header[10] = 0; header[11] = 0; header[12] = 0
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', header), chunk('IDAT', deflateSync(pixels)), chunk('IEND', Buffer.alloc(0))])
}

await mkdir('public/icons', { recursive: true })
for (const size of [192, 512]) await writeFile(`public/icons/orbita-${size}.png`, png(size))
